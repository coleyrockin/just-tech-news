const { isApiRequest } = require('./http');

const withAuth = (req, res, next) => {
  if (!req.session.user_id) {
    if (isApiRequest(req)) {
      res.status(401).json({ message: 'You must be logged in to access this resource.' });
      return;
    }

    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = withAuth;
