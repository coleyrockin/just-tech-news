const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');
const { asyncHandler, httpError } = require('../../utils/http');

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const comments = await Comment.findAll();
    res.json(comments);
  })
);

router.post(
  '/',
  withAuth,
  asyncHandler(async (req, res) => {
    const commentText =
      typeof req.body.comment_text === 'string' ? req.body.comment_text.trim() : '';

    if (!commentText || !req.body.post_id) {
      throw httpError(400, 'Comment text and post id are required.');
    }

    const comment = await Comment.create({
      comment_text: commentText,
      user_id: req.session.user_id,
      post_id: req.body.post_id
    });

    res.status(201).json(comment);
  })
);

router.delete(
  '/:id',
  withAuth,
  asyncHandler(async (req, res) => {
    const deletedCount = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      }
    });

    if (!deletedCount) {
      throw httpError(404, 'No comment found for your account with this id.');
    }

    res.json({ message: 'Comment deleted.' });
  })
);

module.exports = router;
