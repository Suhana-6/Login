# IT Work Portal

A simple college-level full-stack IT job and work registration application using HTML, CSS, JavaScript, Node.js, Express, MySQL and `mysql2`.

## Project structure

```text
IT-Work-Portal/
├── public/
│   ├── index.html          Home page
│   ├── login.html          Login page
│   ├── register.html       Registration page
│   ├── dashboard.html      Private dashboard
│   ├── fresher.html        Fresher application form
│   ├── experienced.html    Experienced application form
│   ├── profile.html        Private profile editor
│   ├── style.css           Shared design
│   ├── login.js             Login request and validation
│   ├── register.js          Registration request and validation
│   ├── dashboard.js         Session, logout and applications
│   ├── work.js              Work form submission
│   └── profile.js           Profile loading and update
├── server.js               Express server and API routes
├── database.sql             MySQL database and table definitions
├── package.json             Node.js dependencies
└── README.md                Setup instructions
```

## Setup in VS Code

1. Open this folder in VS Code.
2. Open MySQL Workbench or a MySQL terminal.
3. Run the complete contents of `database.sql`. It creates the `it_work_portal` database and its three tables.
4. Check the MySQL settings in `server.js`. The default configuration is user `root`, an empty password, and database `it_work_portal`. For another setup, use `DB_HOST`, `DB_USER`, `DB_PASSWORD` and `DB_NAME` environment variables.
5. Open the VS Code terminal and run:

```bash
npm init -y
npm install express mysql2 cors bcrypt express-session
node server.js
```

6. Open `http://localhost:3000` in a browser. Do not open the HTML files with `file://`.

## Hosting

Set these environment variables in the hosting provider before starting the app:

```text
NODE_ENV=production
PORT=3000
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=it_work_portal
SESSION_SECRET=long-random-secret
CLIENT_ORIGIN=https://your-domain.example
```

Start the app with `npm start`. Use `/api/health` as the deployment health check; it returns HTTP 200 only when the server can reach MySQL. Use HTTPS in production. The default Express session store is suitable for local development only; use a persistent session store when running multiple instances or when sessions must survive restarts.

### Vercel

This repository includes `api/index.js` and `vercel.json` so Vercel can run the Express API as a serverless function. In the Vercel project settings, add `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `SESSION_SECRET` as environment variables for the Production environment. Deploy from the repository root, then test `https://your-domain.example/api/health`. The response must show `database: "connected"` before registration and login can work.

## Application flow

Register a new account, then login with the same email or username. The password is stored as a bcrypt hash. A session is created after login, so the dashboard, profile and work forms are protected. Submitting either work form stores a profile record and an application record for the logged-in user. Logout destroys only the session, so the account and application records remain in MySQL.

The profile and applications APIs always use the logged-in user's session ID, so one user cannot read another user's records. SQL values are passed through parameterized queries.

For a production application, add HTTPS, a persistent session store, CSRF protection, stronger validation and secure environment variables for all secrets.