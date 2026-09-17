# Login Project

This is a beginner-friendly full-stack login project built with Node.js, Express, MySQL, HTML, CSS, and JavaScript.

## Project structure

login-project/
├── public/
│   ├── login.html
│   ├── style.css
│   └── script.js
├── server.js
├── database.sql
├── package.json
└── README.md

## How to create the database

1. Open MySQL or MySQL Workbench.
2. Log in as root.
3. Run the SQL file:

```sql
SOURCE database.sql;
```

Or copy the contents of `database.sql` and run them in MySQL.

## Install dependencies

```bash
npm install
```

## Start the project

```bash
node server.js
```

Then open:

```text
http://localhost:3000/login.html
```

## Sample login

- Email: suhana@gmail.com
- Password: suha1234

Note: In production, passwords should normally be hashed using bcrypt before saving to the database. This project keeps the example simple and beginner-friendly.
