const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'it_work_portal'
};

const pool = mysql.createPool(DB_CONFIG);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'it-work-portal-development-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2
    }
  })
);
app.use(express.static(path.join(__dirname, 'public')));

function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' });
    }
    return res.redirect('/login.html');
  }
  next();
}

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard.html', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/fresher.html', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'fresher.html'));
});

app.get('/experienced.html', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'experienced.html'));
});

app.get('/profile.html', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.post('/api/register', async (req, res) => {
  const fullName = (req.body.full_name || '').trim();
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  try {
    const [existingUsername] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsername.length > 0) {
      return res.status(409).json({ success: false, message: 'Username already exists.' });
    }

    const [existingEmail] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO users (full_name, username, email, password) VALUES (?, ?, ?, ?)',
      [fullName, username, email, hashedPassword]
    );

    return res.status(201).json({ success: true, message: 'Account created successfully.' });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

app.post('/api/login', async (req, res) => {
  const identifier = (req.body.identifier || '').trim();
  const password = req.body.password || '';

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username/email or password.' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username/email or password.' });
    }

    req.session.user = {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      email: user.email
    };

    return res.json({ success: true, message: 'Login successful.' });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});

app.get('/api/session', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  res.json({ success: true, user: req.session.user });
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ success: true, database: 'connected' });
  } catch (error) {
    res.status(503).json({ success: false, database: 'unavailable' });
  }
});

app.get('/api/profile', isLoggedIn, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, full_name, username, email FROM users WHERE id = ?',
      [req.session.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, profile: rows[0] });
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

function cleanApplicationValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateApplication(data, category) {
  const requiredFields = category === 'Fresher'
    ? ['full_name', 'email', 'phone', 'qualification', 'college', 'graduation_year', 'job_role', 'skills', 'preferred_location', 'preferred_work', 'expected_salary']
    : ['full_name', 'email', 'phone', 'qualification', 'years_of_experience', 'current_company', 'job_role', 'skills', 'expected_salary', 'preferred_location', 'preferred_work'];

  if (requiredFields.some((field) => !cleanApplicationValue(data[field]))) {
    return 'Please fill all required fields.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanApplicationValue(data.email))) {
    return 'Please enter a valid email address.';
  }

  if (!/^[0-9+()\s-]{7,20}$/.test(cleanApplicationValue(data.phone))) {
    return 'Please enter a valid phone number.';
  }

  if (category === 'Fresher' && !/^\d{4}$/.test(cleanApplicationValue(data.graduation_year))) {
    return 'Please enter a valid graduation year.';
  }

  if (category === 'Experienced' && (Number.isNaN(Number(data.years_of_experience)) || Number(data.years_of_experience) < 0)) {
    return 'Please enter valid years of experience.';
  }

  return null;
}

app.post('/api/fresher', isLoggedIn, async (req, res) => {
  const { full_name, email, phone, qualification, college, graduation_year, expected_salary, resume } = req.body;
  const job_role = req.body.job_role || req.body.jobName;
  const skills = req.body.skills || req.body.technicalSkills;
  const preferred_location = req.body.preferred_location || req.body.preferredLocation;
  const preferred_work = req.body.preferred_work || req.body.preferredITWork;
  const data = { full_name, email, phone, qualification, college, graduation_year, job_role, skills, preferred_location, preferred_work, expected_salary };
  const validationMessage = validateApplication(data, 'Fresher');

  if (validationMessage) {
    return res.status(400).json({ success: false, message: validationMessage });
  }

  try {
    await pool.execute(
      'INSERT INTO applications (user_id, category, full_name, email, phone, qualification, college, graduation_year, job_role, skills, preferred_location, preferred_work, work_type, expected_salary, resume) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.session.user.id, 'Fresher', cleanApplicationValue(full_name), cleanApplicationValue(email).toLowerCase(), cleanApplicationValue(phone), cleanApplicationValue(qualification), cleanApplicationValue(college), cleanApplicationValue(graduation_year), cleanApplicationValue(job_role), cleanApplicationValue(skills), cleanApplicationValue(preferred_location), cleanApplicationValue(preferred_work), cleanApplicationValue(preferred_work), cleanApplicationValue(expected_salary || req.body.expectedSalary), cleanApplicationValue(resume)]
    );

    return res.json({ success: true, message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Fresher application error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

app.post('/api/experienced', isLoggedIn, async (req, res) => {
  const { full_name, email, phone, qualification, years_of_experience, current_company, previous_company, current_designation, resume } = req.body;
  const job_role = req.body.job_role || req.body.jobName;
  const skills = req.body.skills || req.body.technicalSkills;
  const expected_salary = req.body.expected_salary || req.body.expectedSalary;
  const preferred_location = req.body.preferred_location || req.body.preferredLocation;
  const preferred_work = req.body.preferred_work || req.body.preferredITWork;
  const data = { full_name, email, phone, qualification, years_of_experience, current_company, job_role, skills, expected_salary, preferred_location, preferred_work };
  const validationMessage = validateApplication(data, 'Experienced');

  if (validationMessage) {
    return res.status(400).json({ success: false, message: validationMessage });
  }

  try {
    await pool.execute(
      'INSERT INTO applications (user_id, category, full_name, email, phone, qualification, years_of_experience, current_company, previous_company, current_designation, job_role, skills, expected_salary, preferred_location, preferred_work, work_type, resume) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.session.user.id, 'Experienced', cleanApplicationValue(full_name), cleanApplicationValue(email).toLowerCase(), cleanApplicationValue(phone), cleanApplicationValue(qualification), cleanApplicationValue(years_of_experience), cleanApplicationValue(current_company), cleanApplicationValue(previous_company), cleanApplicationValue(current_designation), cleanApplicationValue(job_role), cleanApplicationValue(skills), cleanApplicationValue(expected_salary), cleanApplicationValue(preferred_location), cleanApplicationValue(preferred_work), cleanApplicationValue(preferred_work), cleanApplicationValue(resume)]
    );

    return res.json({ success: true, message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Experienced application error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to connect to server.' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
