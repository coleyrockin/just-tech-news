# Just Tech News

![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)
![Handlebars](https://img.shields.io/badge/Handlebars-6.x-f0772b?style=flat&logo=handlebarsdotjs&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-6.x-52B0E7?style=flat&logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat&logo=mysql&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-30.x-C21325?style=flat&logo=jest&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat)

## About

A full-stack tech news aggregator built with Express.js, Handlebars, and Sequelize following the MVC architecture pattern. Users can create an account, post links to tech articles, upvote posts, and leave comments — similar to Hacker News. Deployed with Netlify Functions for serverless hosting.

## Features

- **User Authentication** — Signup and login with bcrypt-hashed passwords and express-session
- **Post Articles** — Submit tech news links with titles and URLs
- **Upvote System** — Upvote posts from other users
- **Comments** — Leave comments on any post
- **Dashboard** — Manage your own posts with edit and delete functionality
- **MVC Architecture** — Clean separation of models, views, and controllers
- **Serverless Deployment** — Netlify Functions with serverless-http adapter
- **Test Suite** — Jest-based unit tests

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Express.js 4 |
| Templating | Handlebars 6 |
| ORM | Sequelize 6 |
| Database | MySQL 2 |
| Auth | bcryptjs 2, express-session 1 |
| Sessions | connect-session-sequelize 7 |
| Deployment | Netlify Functions, serverless-http 3 |
| Testing | Jest 30 |
| Config | dotenv 16 |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/coleyrockin/just-tech-news.git
cd just-tech-news

# Install dependencies
npm install

# Set up environment variables
cp .env.EXAMPLE .env
# Edit .env with your MySQL credentials

# Create the database
mysql -u root -p < db/schema.sql

# Seed the database
npm run seed

# Start the server
npm start
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| POST | `/api/users/login` | User login |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/:id` | Get post by ID |
| POST | `/api/posts` | Create new post |
| PUT | `/api/posts/:id` | Upvote a post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/comments` | Create comment |
| DELETE | `/api/comments/:id` | Delete comment |

## Project Structure

```
just-tech-news/
├── __tests__/          # Jest test suites
├── config/             # Sequelize connection config
├── controllers/        # Route controllers (home, dashboard, api)
├── db/                 # Schema and seed SQL
├── models/             # Sequelize models (User, Post, Vote, Comment)
├── netlify/functions/  # Serverless function wrapper
├── public/             # Static assets (CSS, JS)
├── seeds/              # Seed data scripts
├── utils/              # Auth middleware and helpers
├── views/              # Handlebars templates and partials
├── app.js              # Express app configuration
├── server.js           # Server entry point
└── netlify.toml        # Netlify deployment config
```

---

Built by [Boyd Roberts](https://github.com/coleyrockin)
