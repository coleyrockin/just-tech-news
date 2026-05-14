const router = require('express').Router();
const { Post, Tag } = require('../models');
const withAuth = require('../utils/auth');
const { asyncHandler, httpError } = require('../utils/http');
const { postAttributes, postInclude, postOrder } = require('../utils/post-query');

const getTags = () =>
  Tag.findAll({
    attributes: ['id', 'name', 'slug', 'color_token'],
    order: [['name', 'ASC']]
  });

router.get(
  '/',
  withAuth,
  asyncHandler(async (req, res) => {
    const [postData, tagData] = await Promise.all([
      Post.findAll({
        where: {
          user_id: req.session.user_id
        },
        attributes: postAttributes(),
        include: postInclude(),
        order: postOrder()
      }),
      getTags()
    ]);
    const posts = postData.map(post => post.get({ plain: true }));
    const tags = tagData.map(tag => tag.get({ plain: true }));

    res.render('dashboard', { posts, tags, loggedIn: true });
  })
);

router.get(
  '/edit/:id',
  withAuth,
  asyncHandler(async (req, res) => {
    const [postData, tagData] = await Promise.all([
      Post.findOne({
        where: {
          id: req.params.id,
          user_id: req.session.user_id
        },
        attributes: postAttributes(),
        include: postInclude()
      }),
      getTags()
    ]);

    if (!postData) {
      throw httpError(404, 'No post found for your account with this id.');
    }

    const post = postData.get({ plain: true });
    const selectedTagIds = new Set(post.tags.map(tag => tag.id));
    const tags = tagData.map(tag => {
      const plainTag = tag.get({ plain: true });

      return {
        ...plainTag,
        selected: selectedTagIds.has(plainTag.id)
      };
    });

    res.render('edit-post', {
      post,
      tags,
      loggedIn: true
    });
  })
);

module.exports = router;
