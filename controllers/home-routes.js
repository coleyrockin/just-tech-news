const { URLSearchParams } = require('url');
const router = require('express').Router();
const { Post, Tag } = require('../models');
const { asyncHandler, httpError } = require('../utils/http');
const {
  buildPagination,
  fetchDiscoveryPosts,
  normalizeDiscoveryQuery,
  postAttributes,
  postInclude
} = require('../utils/post-query');
const { validateSlug } = require('../utils/validation');

const sortLabels = {
  newest: 'Newest',
  top: 'Top',
  trending: 'Trending'
};

const getTags = () =>
  Tag.findAll({
    attributes: ['id', 'name', 'slug', 'description', 'color_token'],
    order: [['name', 'ASC']]
  });

const buildHref = (pathname, filters, overrides = {}) => {
  const params = new URLSearchParams();
  const nextFilters = { ...filters, ...overrides };

  if (nextFilters.q) {
    params.set('q', nextFilters.q);
  }

  if (nextFilters.sort && nextFilters.sort !== 'newest') {
    params.set('sort', nextFilters.sort);
  }

  if (nextFilters.page && nextFilters.page > 1) {
    params.set('page', nextFilters.page);
  }

  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
};

const buildDiscoveryViewModel = ({ req, filters, tags, pagination, topic = null }) => {
  const pathname = topic ? `/topics/${topic.slug}` : '/';
  const tagOptions = tags.map(tag => ({
    ...tag.get({ plain: true }),
    active: tag.slug === filters.tag,
    href: `/topics/${tag.slug}`
  }));
  const sortOptions = Object.entries(sortLabels).map(([value, label]) => ({
    value,
    label,
    active: value === filters.sort,
    href: buildHref(pathname, filters, { sort: value, page: 1 })
  }));

  return {
    loggedIn: req.session.loggedIn,
    filters,
    searchValue: filters.q,
    sortOptions,
    tagOptions,
    topic,
    pagination: {
      ...pagination,
      previousHref: buildHref(pathname, filters, { page: filters.page - 1 }),
      nextHref: buildHref(pathname, filters, { page: filters.page + 1 })
    },
    searchAction: pathname
  };
};

const renderDiscoveryPage = async (req, res, overrides = {}) => {
  const filters = normalizeDiscoveryQuery({ ...req.query, ...overrides });
  const [tags, postData] = await Promise.all([getTags(), fetchDiscoveryPosts(Post, filters)]);
  const posts = postData.rows.map(post => post.get({ plain: true }));
  const pagination = buildPagination({
    count: postData.count,
    page: filters.page,
    pageSize: filters.pageSize
  });
  const topic = filters.tag ? tags.find(tag => tag.slug === filters.tag)?.get({ plain: true }) : null;

  if (filters.tag && !topic) {
    throw httpError(404, 'No topic found with this slug.');
  }

  res.render('homepage', {
    posts,
    ...buildDiscoveryViewModel({ req, filters, tags, pagination, topic })
  });
};

router.get(
  '/',
  asyncHandler(async (req, res) => {
    await renderDiscoveryPage(req, res);
  })
);

router.get(
  '/topics',
  asyncHandler(async (req, res) => {
    const tags = await getTags();

    res.render('topics', {
      tags: tags.map(tag => tag.get({ plain: true })),
      loggedIn: req.session.loggedIn
    });
  })
);

router.get(
  '/topics/:slug',
  asyncHandler(async (req, res) => {
    await renderDiscoveryPage(req, res, { tag: validateSlug(req.params.slug) });
  })
);

router.get(
  '/post/:id',
  asyncHandler(async (req, res) => {
    const postData = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: postAttributes(),
      include: postInclude()
    });

    if (!postData) {
      throw httpError(404, 'No post found with this id.');
    }

    const post = postData.get({ plain: true });

    res.render('single-post', {
      post,
      loggedIn: req.session.loggedIn
    });
  })
);

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
