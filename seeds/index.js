const seedUsers = require('./user-seeds');
const seedPosts = require('./post-seeds');
const seedComments = require('./comment-seeds');
const seedVotes = require('./vote-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  await seedUsers();
  await seedPosts();
  await seedComments();
  await seedVotes();
  console.log('Database seeded successfully.');

  process.exit(0);
};

seedAll();
