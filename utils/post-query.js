const sequelize = require('../config/connection');
const { Op } = require('sequelize');
const { User, Comment, Tag } = require('../models');
const {
  DEFAULT_PAGE_SIZE,
  validateOptionalSlug,
  validatePage,
  validatePageSize,
  validateSearchQuery,
  validateSort
} = require('./validation');

const buildVoteCountAttribute = () => [
  sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
  'vote_count'
];

const buildCommentCountAttribute = () => [
  sequelize.literal('(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)'),
  'comment_count'
];

const postAttributes = () => [
  'id',
  'post_url',
  'title',
  'created_at',
  buildVoteCountAttribute(),
  buildCommentCountAttribute()
];

const commentInclude = () => ({
  model: Comment,
  attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
  include: {
    model: User,
    attributes: ['username']
  }
});

const tagInclude = ({ tag = '', attributes = ['id', 'name', 'slug', 'color_token'] } = {}) => ({
  model: Tag,
  as: 'tags',
  attributes,
  through: {
    attributes: []
  },
  required: Boolean(tag),
  ...(tag ? { where: { slug: tag } } : {})
});

const postInclude = ({
  includeAuthor = true,
  includeComments = true,
  tag = '',
  tagAttributes,
  authorAttributes = ['username']
} = {}) => {
  const include = [tagInclude({ tag, attributes: tagAttributes })];

  if (includeComments) {
    include.unshift(commentInclude());
  }

  if (includeAuthor) {
    include.push({
      model: User,
      attributes: authorAttributes
    });
  }

  return include;
};

const postOrder = sort => {
  if (sort === 'top') {
    return [[sequelize.literal('vote_count'), 'DESC'], ['created_at', 'DESC']];
  }

  if (sort === 'trending') {
    return [
      [
        sequelize.literal(`(
          (SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id) * 3 +
          (SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id) * 2 -
          (TIMESTAMPDIFF(HOUR, post.created_at, NOW()) / 24)
        )`),
        'DESC'
      ],
      ['created_at', 'DESC']
    ];
  }

  return [['created_at', 'DESC']];
};

const normalizeDiscoveryQuery = query => {
  const page = validatePage(query.page);
  const pageSize = validatePageSize(query.pageSize || DEFAULT_PAGE_SIZE);

  return {
    q: validateSearchQuery(query.q),
    sort: validateSort(query.sort),
    tag: validateOptionalSlug(query.tag),
    page,
    pageSize,
    limit: pageSize,
    offset: (page - 1) * pageSize
  };
};

const buildSearchWhere = q => {
  if (!q) {
    return {};
  }

  const likeQuery = `%${q}%`;

  return {
    [Op.or]: [
      { title: { [Op.like]: likeQuery } },
      { post_url: { [Op.like]: likeQuery } },
      { '$user.username$': { [Op.like]: likeQuery } },
      { '$tags.name$': { [Op.like]: likeQuery } },
      { '$tags.slug$': { [Op.like]: likeQuery } }
    ]
  };
};

const buildPostQueryOptions = ({ q, sort, tag, limit, offset, where = {} }) => {
  return {
    where: {
      ...where,
      ...buildSearchWhere(q)
    },
    attributes: postAttributes(),
    include: postInclude({ tag }),
    order: postOrder(sort),
    limit,
    offset,
    distinct: true,
    subQuery: false
  };
};

const buildPostFilterOptions = ({ q, tag, where = {} }) => ({
  where: {
    ...where,
    ...buildSearchWhere(q)
  },
  include: postInclude({
    includeComments: false,
    tag,
    tagAttributes: [],
    authorAttributes: []
  }),
  subQuery: false
});

const fetchDiscoveryPosts = async (Post, filters) => {
  const filterOptions = buildPostFilterOptions(filters);
  const [count, idRows] = await Promise.all([
    Post.count({
      ...filterOptions,
      distinct: true,
      col: 'id'
    }),
    Post.findAll({
      ...filterOptions,
      attributes: ['id', buildVoteCountAttribute(), buildCommentCountAttribute()],
      order: postOrder(filters.sort),
      group: ['post.id'],
      limit: filters.limit,
      offset: filters.offset
    })
  ]);
  const postIds = idRows.map(post => post.id);

  if (!postIds.length) {
    return { count, rows: [] };
  }

  const rows = await Post.findAll({
    where: {
      id: postIds
    },
    attributes: postAttributes(),
    include: postInclude(),
    order: postOrder(filters.sort)
  });
  const rowsById = new Map(rows.map(post => [post.id, post]));

  return {
    count,
    rows: postIds.map(id => rowsById.get(id)).filter(Boolean)
  };
};

const buildPagination = ({ count, page, pageSize }) => {
  const totalPages = Math.max(Math.ceil(count / pageSize), 1);

  return {
    count,
    currentPage: page,
    pageSize,
    totalPages,
    hasPrevious: page > 1,
    hasNext: page < totalPages
  };
};

module.exports = {
  buildPagination,
  buildPostQueryOptions,
  fetchDiscoveryPosts,
  normalizeDiscoveryQuery,
  postAttributes,
  postInclude,
  postOrder
};
