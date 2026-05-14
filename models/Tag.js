const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Tag extends Model {}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 50]
      }
    },
    slug: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        len: [2, 60]
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    color_token: {
      type: DataTypes.STRING(32),
      allowNull: true
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
    indexes: [
      {
        unique: true,
        fields: ['slug']
      }
    ]
  }
);

module.exports = Tag;
