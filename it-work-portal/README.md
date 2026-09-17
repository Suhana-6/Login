# IT Work Portal

This is a beginner-friendly full-stack project for an IT job and work portal built with:

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Vercel Postgres

## Project structure

- public/login.html
- public/register.html
- public/dashboard.html
- public/fresher.html
- public/experienced.html
- public/profile.html
- public/css/style.css
- public/js/login.js
- public/js/register.js
- public/js/dashboard.js
- public/js/application.js
- public/js/profile.js
- server.js
- database.sql
- package.json
- README.md

## Install dependencies

```bash
npm install
```

## Start the app

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Database setup

1. Create a Vercel Postgres/Neon database.
2. Run the SQL in `database.sql` in the provider's SQL editor.
3. Add the `POSTGRES_URL` connection string to Vercel environment variables.
4. Start the server.

## Important note

Passwords are hashed using bcrypt for security. In a production app, you would continue using strong password hashing and secure session management.

## Vercel deployment

For deployment, connect a Vercel Postgres/Neon database and set the `POSTGRES_URL` environment variable in Vercel.

Set these Vercel environment variables for the Production environment:

```text
POSTGRES_URL=your-neon-or-vercel-postgres-connection-string
SESSION_SECRET=long-random-secret
```

Run `database.sql` once in the connected Postgres SQL editor. Deploy with the Vercel project root set to `it-work-portal`, then test `/api/health`. It should return `database: "connected"` before registration and login are used.
