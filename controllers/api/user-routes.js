const router = require('express').Router();
const { User, Post, Comment, Vote } = require('../../models');
const withAuth = require('../../utils/auth');
const { asyncHandler, httpError } = require('../../utils/http');

const USER_FIELDS = ['username', 'email', 'password'];

const serializeUser = user => {
  const safeUser = user.get({ plain: true });
  delete safeUser.password;
  return safeUser;
};

const saveSession = req =>
  new Promise((resolve, reject) => {
    req.session.save(error => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const destroySession = req =>
  new Promise((resolve, reject) => {
    req.session.destroy(error => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const setUserSession = (req, user) => {
  req.session.user_id = user.id;
  req.session.username = user.username;
  req.session.loggedIn = true;
};

const requireSelf = (req, userId) => {
  if (Number(req.session.user_id) !== Number(userId)) {
    throw httpError(403, 'You can only manage your own user account.');
  }
};

const pickUserUpdates = body =>
  USER_FIELDS.reduce((updates, field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }

    return updates;
  }, {});

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.json(users);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findOne({
      attributes: { exclude: ['password'] },
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_url', 'created_at']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'created_at'],
          include: {
            model: Post,
            attributes: ['title']
          }
        },
        {
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        }
      ]
    });

    if (!user) {
      throw httpError(404, 'No user found with this id.');
    }

    res.json(user);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    setUserSession(req, user);
    await saveSession(req);

    res.status(201).json({
      user: serializeUser(user),
      message: 'Account created.'
    });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user || !user.checkPassword(req.body.password)) {
      throw httpError(400, 'Incorrect email or password.');
    }

    setUserSession(req, user);
    await saveSession(req);

    res.json({
      user: serializeUser(user),
      message: 'You are now logged in.'
    });
  })
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    if (req.session.loggedIn) {
      await destroySession(req);
    }

    res.status(204).end();
  })
);

router.put(
  '/:id',
  withAuth,
  asyncHandler(async (req, res) => {
    requireSelf(req, req.params.id);

    const updates = pickUserUpdates(req.body);

    if (!Object.keys(updates).length) {
      throw httpError(400, 'No supported user fields were provided.');
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      throw httpError(404, 'No user found with this id.');
    }

    await user.update(updates);

    res.json({
      user: serializeUser(user),
      message: 'User updated.'
    });
  })
);

router.delete(
  '/:id',
  withAuth,
  asyncHandler(async (req, res) => {
    requireSelf(req, req.params.id);

    const user = await User.findByPk(req.params.id);

    if (!user) {
      throw httpError(404, 'No user found with this id.');
    }

    await user.destroy();
    await destroySession(req);

    res.json({ message: 'User deleted.' });
  })
);

module.exports = router;
