const router = require('express').Router();
const { Post, User, Comment, Vote, Tag } = require('../../models');
const withAuth = require('../../utils/auth');
const { asyncHandler, httpError } = require('../../utils/http');
const {
  buildPagination,
  fetchDiscoveryPosts,
  normalizeDiscoveryQuery,
  postAttributes,
  postInclude
} = require('../../utils/post-query');
const { normalizeText, requirePositiveInteger, validateHttpUrl, validateTagIds } = require('../../utils/validation');

const getExistingTagIds = async tagIds => {
  if (!tagIds.length) {
    return [];
  }

  const tags = await Tag.findAll({
    where: {
      id: tagIds
    },
    attributes: ['id']
  });

  if (tags.length !== tagIds.length) {
    throw httpError(400, 'One or more selected topics do not exist.');
  }

  return tagIds;
};

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filters = normalizeDiscoveryQuery(req.query);
    const { count, rows } = await fetchDiscoveryPosts(Post, filters);
    const posts = rows.map(post => post.get({ plain: true }));

    res.json({
      posts,
      filters,
      pagination: buildPagination({ count, page: filters.page, pageSize: filters.pageSize })
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const post = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: postAttributes(),
      include: postInclude()
    });

    if (!post) {
      throw httpError(404, 'No post found with this id.');
    }

    res.json(post);
  })
);

router.post(
  '/',
  withAuth,
  asyncHandler(async (req, res) => {
    const title = normalizeText(req.body.title);
    const post_url = validateHttpUrl(req.body.post_url);
    const tagIds = await getExistingTagIds(validateTagIds(req.body.tag_ids));

    if (!title || !post_url) {
      throw httpError(400, 'Post title and URL are required.');
    }

    const post = await Post.create({
      title,
      post_url,
      user_id: req.session.user_id
    });

    await post.setTags(tagIds);

    res.status(201).json(post);
  })
);

router.put(
  '/upvote',
  withAuth,
  asyncHandler(async (req, res) => {
    const postId = requirePositiveInteger(req.body.post_id, 'A valid post id is required.');
    const post = await Post.findByPk(postId);

    if (!post) {
      throw httpError(404, 'No post found with this id.');
    }

    const updatedPost = await Post.upvote(
      { post_id: postId, user_id: req.session.user_id },
      { Vote, Comment, User, Tag }
    );

    res.json(updatedPost);
  })
);

router.put(
  '/:id',
  withAuth,
  asyncHandler(async (req, res) => {
    const title = normalizeText(req.body.title);
    const tagIds = await getExistingTagIds(validateTagIds(req.body.tag_ids));

    if (!title) {
      throw httpError(400, 'Post title is required.');
    }

    const post = await Post.findOne({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      }
    });

    if (!post) {
      throw httpError(404, 'No post found for your account with this id.');
    }

    await post.update({ title });
    await post.setTags(tagIds);
    res.json(post);
  })
);

router.delete(
  '/:id',
  withAuth,
  asyncHandler(async (req, res) => {
    const deletedCount = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      }
    });

    if (!deletedCount) {
      throw httpError(404, 'No post found for your account with this id.');
    }

    res.json({ message: 'Post deleted.' });
  })
);

module.exports = router;
