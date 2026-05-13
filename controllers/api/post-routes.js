const router = require('express').Router();
const { Post, User, Comment, Vote } = require('../../models');
const withAuth = require('../../utils/auth');
const { asyncHandler, httpError } = require('../../utils/http');
const { postAttributes, postInclude, postOrder } = require('../../utils/post-query');

const normalizeText = value => (typeof value === 'string' ? value.trim() : '');

const requirePostId = value => {
  const postId = Number(value);

  if (!Number.isInteger(postId) || postId < 1) {
    throw httpError(400, 'A valid post id is required.');
  }

  return postId;
};

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const posts = await Post.findAll({
      attributes: postAttributes(),
      include: postInclude(),
      order: postOrder()
    });

    res.json(posts);
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
    const post_url = normalizeText(req.body.post_url);

    if (!title || !post_url) {
      throw httpError(400, 'Post title and URL are required.');
    }

    const post = await Post.create({
      title,
      post_url,
      user_id: req.session.user_id
    });

    res.status(201).json(post);
  })
);

router.put(
  '/upvote',
  withAuth,
  asyncHandler(async (req, res) => {
    const postId = requirePostId(req.body.post_id);
    const post = await Post.findByPk(postId);

    if (!post) {
      throw httpError(404, 'No post found with this id.');
    }

    const updatedPost = await Post.upvote(
      { post_id: postId, user_id: req.session.user_id },
      { Vote, Comment, User }
    );

    res.json(updatedPost);
  })
);

router.put(
  '/:id',
  withAuth,
  asyncHandler(async (req, res) => {
    const title = normalizeText(req.body.title);

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
