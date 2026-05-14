const router = require('express').Router();
const { Tag } = require('../../models');
const { asyncHandler } = require('../../utils/http');

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const tags = await Tag.findAll({
      attributes: ['id', 'name', 'slug', 'description', 'color_token'],
      order: [['name', 'ASC']]
    });

    res.json(tags);
  })
);

module.exports = router;
