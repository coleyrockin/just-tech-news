# Just Tech News

![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)
![Handlebars](https://img.shields.io/badge/Handlebars-6.x-f0772b?style=flat&logo=handlebarsdotjs&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-6.x-52B0E7?style=flat&logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat&logo=mysql&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-30.x-C21325?style=flat&logo=jest&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat)

Just Tech News is a full-stack link-sharing app for tech articles. It uses Express, Handlebars, Sequelize, MySQL, session auth, upvotes, comments, and dashboard-based post management.

Live deployment: [https://just-tech-news.vercel.app](https://just-tech-news.vercel.app)

## Features

- Account signup, login, logout, and bcrypt password hashing
- Authenticated post creation, editing, deletion, commenting, and upvoting
- One upvote per user per post
- Owner-only update/delete controls for user accounts, posts, and comments
- Handlebars-rendered pages with API-backed form actions
- Shared Express app for local Node, Netlify Functions, and Vercel serverless hosting
- Jest, ESLint, npm audit, and CI checks for Node 20 and 22

## Tech Stack

| Area       | Tooling                                                  |
| ---------- | -------------------------------------------------------- |
| Server     | Node.js 20+, Express 4                                   |
| Views      | Express Handlebars 6                                     |
| Data       | MySQL 8, Sequelize 6, mysql2                             |
| Auth       | express-session, connect-session-sequelize, bcryptjs     |
| Serverless | Vercel Node function, Netlify Functions, serverless-http |
| Quality    | Jest 30, ESLint 9, Prettier 3, GitHub Actions            |

## Local Setup

```bash
git clone https://github.com/coleyrockin/just-tech-news.git
cd just-tech-news
npm install
cp .env.example .env
```

Update `.env` with your MySQL credentials and a strong `SESSION_SECRET`.

Create the local database:

```bash
mysql -u root -p < db/schema.sql
npm run seeds
```

Run the app:

```bash
npm start
```

The default local URL is `http://localhost:3001`.

## Environment Variables

| Variable         | Required            | Notes                                                      |
| ---------------- | ------------------- | ---------------------------------------------------------- |
| `SESSION_SECRET` | Yes                 | Required in production. Use a long random value.           |
| `DATABASE_URL`   | Production          | Preferred hosted MySQL connection string.                  |
| `JAWSDB_URL`     | Production fallback | Supported for Heroku/JawsDB-style deployments.             |
| `DB_NAME`        | Local               | Defaults to `just_tech_news_db` in `.env.example`.         |
| `DB_USER`        | Local               | MySQL user.                                                |
| `DB_PASSWORD`    | Local               | MySQL password.                                            |
| `DB_HOST`        | Local               | Defaults to `localhost`.                                   |
| `DB_PORT`        | Local               | Defaults to `3306`.                                        |
| `DB_SSL`         | Hosted DB dependent | Set to `true` for hosted MySQL providers that require SSL. |
| `PORT`           | Local optional      | Defaults to `3001`.                                        |

## Scripts

| Command                          | Purpose                                       |
| -------------------------------- | --------------------------------------------- |
| `npm start`                      | Start the Express server.                     |
| `npm run seeds`                  | Recreate and seed database tables.            |
| `npm test`                       | Run Jest tests.                               |
| `npm run lint`                   | Run ESLint.                                   |
| `npm run check`                  | Run lint and tests.                           |
| `npm run format`                 | Format supported project files with Prettier. |
| `npm run deploy:preview`         | Deploy a Vercel preview.                      |
| `npm run deploy:prod`            | Deploy to Vercel production.                  |
| `npm run netlify:dev`            | Run Netlify's local dev server.               |
| `npm run netlify:deploy:preview` | Deploy a Netlify preview.                     |
| `npm run netlify:deploy:prod`    | Deploy to Netlify production.                 |

## Deployment

The app can run in three modes:

- Local Node: `server.js` starts the shared Express app.
- Vercel: `api/index.js` wraps the shared Express app as a serverless function, with static assets routed from `public/`.
- Netlify: `netlify/functions/server.js` wraps the same app with `serverless-http`.

Before deploying, set production environment variables in the hosting provider:

```text
SESSION_SECRET
DATABASE_URL or JAWSDB_URL
DB_SSL=true if your hosted MySQL provider requires it
```

The current Vercel project is configured for the app code and routes. Add the production environment variables above in Vercel before relying on database-backed routes.

Health check endpoint:

```text
GET /healthz
```

It returns `{ "status": "ok" }` when the app can connect to the database.

## Project Structure

```text
just-tech-news/
├── api/                 # Vercel serverless entry
├── __tests__/           # Jest tests
├── config/              # Sequelize connection
├── controllers/         # Page and API routes
├── db/                  # Local database schema
├── models/              # Sequelize models and associations
├── netlify/functions/   # Netlify serverless entry
├── public/              # CSS, browser JavaScript, and assets
├── seeds/               # Seed data
├── utils/               # Auth, helpers, query builders, HTTP helpers
├── views/               # Handlebars templates and partials
├── app.js               # Shared Express app
├── server.js            # Local Node server
├── netlify.toml         # Netlify config
└── vercel.json          # Vercel config
```

## Quality Checklist

Run these before pushing:

```bash
npm run lint
npm test
npm audit --omit=dev
```

CI runs lint and tests against Node 20 and Node 22 on pushes and pull requests to `main`.

## License

ISC
