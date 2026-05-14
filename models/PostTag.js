const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class PostTag extends Model {}

PostTag.init(
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'post',
        key: 'id'
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tag',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post_tag',
    indexes: [
      {
        fields: ['tag_id']
      }
    ]
  }
);

module.exports = PostTag;
