const serverless = require('serverless-http');

const { app, initializeApp } = require('../app');

const handler = serverless(app);

module.exports = async (req, res) => {
  await initializeApp();
  return handler(req, res);
};
