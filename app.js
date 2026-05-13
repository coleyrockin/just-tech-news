const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');
const { asyncHandler, errorHandler, notFoundHandler } = require('./utils/http');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || 'dev-session-secret';

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in production.');
}

const sessionStore = new SequelizeStore({
  db: sequelize
});

const sess = {
  secret: sessionSecret,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax'
  },
  resave: false,
  saveUninitialized: false,
  store: sessionStore
};

const hbs = exphbs.create({ helpers });

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get(
  '/healthz',
  asyncHandler(async (_req, res) => {
    await sequelize.authenticate();
    res.status(200).json({ status: 'ok' });
  })
);

app.use(require('./controllers/'));
app.use(notFoundHandler);
app.use(errorHandler);

let initializationPromise;

const initializeApp = async () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await sequelize.sync({ force: false });
      await sessionStore.sync();
    })().catch(error => {
      initializationPromise = undefined;
      throw error;
    });
  }

  return initializationPromise;
};

module.exports = { app, initializeApp };
