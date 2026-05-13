const router = require('express').Router();
const { Post } = require('../models');
const { asyncHandler, httpError } = require('../utils/http');
const { postAttributes, postInclude, postOrder } = require('../utils/post-query');

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const postData = await Post.findAll({
      attributes: postAttributes(),
      include: postInclude(),
      order: postOrder()
    });
    const posts = postData.map(post => post.get({ plain: true }));

    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn
    });
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
