const router = require('express').Router();
const { Post } = require('../models');
const withAuth = require('../utils/auth');
const { asyncHandler, httpError } = require('../utils/http');
const { postAttributes, postInclude, postOrder } = require('../utils/post-query');

router.get(
  '/',
  withAuth,
  asyncHandler(async (req, res) => {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id
      },
      attributes: postAttributes(),
      include: postInclude(),
      order: postOrder()
    });
    const posts = postData.map(post => post.get({ plain: true }));

    res.render('dashboard', { posts, loggedIn: true });
  })
);

router.get(
  '/edit/:id',
  withAuth,
  asyncHandler(async (req, res) => {
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      },
      attributes: postAttributes(),
      include: postInclude()
    });

    if (!postData) {
      throw httpError(404, 'No post found for your account with this id.');
    }

    const post = postData.get({ plain: true });

    res.render('edit-post', {
      post,
      loggedIn: true
    });
  })
);

module.exports = router;
