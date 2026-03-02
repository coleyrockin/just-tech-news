const serverless = require('serverless-http');

const { app, initializeApp } = require('../../app');

const handler = serverless(app);

exports.handler = async (event, context) => {
  await initializeApp();
  return handler(event, context);
};
