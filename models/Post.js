const { Model, DataTypes } = require('sequelize');
const { URL } = require('url');
const sequelize = require('../config/connection');

class Post extends Model {
  static upvote(body, models) {
    return models.Vote.findOrCreate({
      where: {
        user_id: body.user_id,
        post_id: body.post_id
      }
    }).then(([_vote, created]) => {
      if (!created) {
        const error = new Error('You have already upvoted this post.');
        error.statusCode = 409;
        throw error;
      }

      return Post.findOne({
        where: {
          id: body.post_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
            'vote_count'
          ]
        ],
        include: [
          {
            model: models.Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: models.User,
              attributes: ['username']
            }
          },
          {
            model: models.User,
            attributes: ['username']
          },
          {
            model: models.Tag,
            as: 'tags',
            attributes: ['id', 'name', 'slug', 'color_token'],
            through: {
              attributes: []
            }
          }
        ]
      });
    });
  }
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    post_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isURL: true,
        isHttpUrl(value) {
          const { protocol } = new URL(value);

          if (!['http:', 'https:'].includes(protocol)) {
            throw new Error('Post URL must use HTTP or HTTPS.');
          }
        }
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
  }
);

module.exports = Post;
