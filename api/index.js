const { app, initializeApp } = require('../app');

module.exports = async (req, res) => {
  await initializeApp();
  return app(req, res);
};
