const sequelize = require('../config/connection');
const { User, Comment } = require('../models');

const buildVoteCountAttribute = () => [
  sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
  'vote_count'
];

const postAttributes = () => ['id', 'post_url', 'title', 'created_at', buildVoteCountAttribute()];

const commentInclude = () => ({
  model: Comment,
  attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
  include: {
    model: User,
    attributes: ['username']
  }
});

const postInclude = ({ includeAuthor = true } = {}) => {
  const include = [commentInclude()];

  if (includeAuthor) {
    include.push({
      model: User,
      attributes: ['username']
    });
  }

  return include;
};

const postOrder = () => [['created_at', 'DESC']];

module.exports = {
  postAttributes,
  postInclude,
  postOrder
};
