# IT Work Portal

This is a beginner-friendly full-stack project for an IT job and work portal built with:

- HTML
- CSS
- JavaScript
- Node.js
- Express
- MySQL

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

1. Open MySQL or MySQL Workbench.
2. Create the database using the SQL in `database.sql`.
3. Run the file. If the database already exists, run the two `ALTER TABLE` statements in the file to add the new application fields.
4. Start the server.

## Important note

Passwords are hashed using bcrypt for security. In a production app, you would continue using strong password hashing and secure session management.
