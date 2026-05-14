const seedUsers = require('./user-seeds');
const seedTags = require('./tag-seeds');
const seedPosts = require('./post-seeds');
const seedPostTags = require('./post-tag-seeds');
const seedComments = require('./comment-seeds');
const seedVotes = require('./vote-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  await seedUsers();
  await seedTags();
  await seedPosts();
  await seedPostTags();
  await seedComments();
  await seedVotes();
  console.log('Database seeded successfully.');

  process.exit(0);
};

seedAll();
