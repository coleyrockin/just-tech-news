// import all models
const Post = require('./Post');
const User = require('./User');
const Vote = require('./Vote');
const Comment = require('./Comment');
const Tag = require('./Tag');
const PostTag = require('./PostTag');

// create associations
User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',

  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});

Vote.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'SET NULL'
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

Post.belongsToMany(Tag, {
  through: PostTag,
  as: 'tags',
  foreignKey: 'post_id',
  otherKey: 'tag_id',
  onDelete: 'CASCADE'
});

Tag.belongsToMany(Post, {
  through: PostTag,
  as: 'posts',
  foreignKey: 'tag_id',
  otherKey: 'post_id',
  onDelete: 'CASCADE'
});

PostTag.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});

PostTag.belongsTo(Tag, {
  foreignKey: 'tag_id',
  onDelete: 'CASCADE'
});

Post.hasMany(PostTag, {
  foreignKey: 'post_id'
});

Tag.hasMany(PostTag, {
  foreignKey: 'tag_id'
});

module.exports = { User, Post, Vote, Comment, Tag, PostTag };
