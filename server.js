const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const publicDirectory = path.join(__dirname, 'public');
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'it_work_portal',
    waitForConnections: true,
    connectionLimit: 10
});

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'it-work-portal-development-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: isProduction, maxAge: 24 * 60 * 60 * 1000 }
}));

function requireLogin(req, res, next) {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Please log in first.' });
    next();
}

function requirePageLogin(req, res, next) {
    if (!req.session.user) return res.redirect('/login.html');
    next();
}

function clean(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function sendPage(page) {
    return (req, res) => res.sendFile(path.join(publicDirectory, page));
}

app.post('/api/register', async (req, res) => {
    const fullName = clean(req.body.fullName || req.body.full_name);
    const username = clean(req.body.username);
    const email = clean(req.body.email).toLowerCase();
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || req.body.confirm_password || '';
    if (!fullName || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Please enter all required fields.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }
    try {
        const [existing] = await db.execute('SELECT username, email FROM users WHERE username = ? OR email = ? LIMIT 1', [username, email]);
        if (existing.some((user) => user.email === email)) return res.status(409).json({ success: false, message: 'Email already registered.' });
        if (existing.some((user) => user.username === username)) return res.status(409).json({ success: false, message: 'Username already exists.' });
        const passwordHash = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (full_name, username, email, password) VALUES (?, ?, ?, ?)', [fullName, username, email, passwordHash]);
        res.status(201).json({ success: true, message: 'Account created successfully.' });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ success: false, message: 'Unable to create the account right now.' });
    }
});

app.post('/api/login', async (req, res) => {
    const identifier = clean(req.body.identifier || req.body.email);
    const password = req.body.password || '';
    if (!identifier || !password) return res.status(400).json({ success: false, message: 'Username/email and password are required.' });
    try {
        const [users] = await db.execute('SELECT id, full_name, username, email, password FROM users WHERE email = ? OR username = ? LIMIT 1', [identifier.toLowerCase(), identifier]);
        const user = users[0];
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: 'Invalid username/email or password.' });
        req.session.user = { id: user.id, fullName: user.full_name, username: user.username, email: user.email };
        res.json({ success: true, message: 'Login successful', user: req.session.user });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ success: false, message: 'Unable to process login right now.' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => res.json({ success: true, message: 'Logged out successfully.' }));
});

app.get('/api/session', (req, res) => {
    if (!req.session.user) return res.json({ success: false, authenticated: false, message: 'Not logged in.' });
    res.json({ success: true, authenticated: true, user: req.session.user });
});

app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({ success: true, database: 'connected' });
    } catch (error) {
        res.status(503).json({ success: false, database: 'unavailable' });
    }
});

app.get('/api/profile', requireLogin, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, full_name, username, email, phone, location, qualification, skills, work_type, experience FROM users WHERE id = ?', [req.session.user.id]);
        res.json({ success: true, profile: rows[0] || null });
    } catch (error) {
        console.error('Profile read error:', error.message);
        res.status(500).json({ success: false, message: 'Unable to load your profile.' });
    }
});

app.put('/api/profile', requireLogin, async (req, res) => {
    const fullName = clean(req.body.fullName);
    if (!fullName) return res.status(400).json({ success: false, message: 'Full name is required.' });
    try {
        await db.execute('UPDATE users SET full_name = ?, phone = ?, location = ?, qualification = ?, skills = ?, work_type = ?, experience = ? WHERE id = ?', [fullName, clean(req.body.phone), clean(req.body.location), clean(req.body.qualification), clean(req.body.skills), clean(req.body.workType), clean(req.body.experience), req.session.user.id]);
        req.session.user.fullName = fullName;
        res.json({ success: true, message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Profile update error:', error.message);
        res.status(500).json({ success: false, message: 'Unable to update your profile.' });
    }
});

async function saveWorkProfile(req, res, experienceType) {
    const body = req.body;
    const workType = clean(body.preferredITWork || body.workType || body.work_type);
    const jobName = clean(body.jobName || body.jobRole);
    const technicalSkills = clean(body.technicalSkills || body.skills || body.primarySkill);
    const preferredLocation = clean(body.preferredLocation || body.location);
    const expectedSalary = clean(body.expectedSalary);
    if (!workType || !jobName || !technicalSkills || !preferredLocation || !expectedSalary || !clean(body.fullName) || !clean(body.email)) return res.status(400).json({ success: false, message: 'Please complete all required application fields.' });
    if (!/^\S+@\S+\.\S+$/.test(clean(body.email))) return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    const normalizedBody = { ...body, jobName, technicalSkills, preferredITWork: workType, preferredLocation, expectedSalary };
    const extraData = JSON.stringify(normalizedBody);
    try {
        await db.execute('INSERT INTO work_profiles (user_id, work_type, experience_type, qualification, phone, location, skills, experience_years, company_name, designation, expected_salary, work_mode, extra_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [req.session.user.id, workType, experienceType, clean(body.qualification), clean(body.phone), preferredLocation, technicalSkills, Number(body.experienceYears || body.totalExperience) || 0, clean(body.companyName || body.currentCompany), clean(body.designation || body.currentDesignation), expectedSalary, clean(body.workMode), extraData]);
        await db.execute('INSERT INTO applications (user_id, work_type, experience_type) VALUES (?, ?, ?)', [req.session.user.id, workType, experienceType]);
        await db.execute('UPDATE users SET phone = ?, location = ?, qualification = ?, skills = ?, work_type = ?, experience = ? WHERE id = ?', [clean(body.phone), clean(body.location), clean(body.qualification), technicalSkills, workType, experienceType, req.session.user.id]);
        res.status(201).json({ success: true, message: 'Application submitted successfully.' });
    } catch (error) {
        console.error('Work profile error:', error.message);
        res.status(500).json({ success: false, message: 'Unable to save your application.' });
    }
}

app.post('/api/fresher', requireLogin, (req, res) => saveWorkProfile(req, res, 'Fresher'));
app.post('/api/experienced', requireLogin, (req, res) => saveWorkProfile(req, res, 'Experienced'));

app.get('/api/applications', requireLogin, async (req, res) => {
    try {
        const [applications] = await db.execute('SELECT id, work_type, experience_type, application_status, created_at FROM applications WHERE user_id = ? ORDER BY created_at DESC', [req.session.user.id]);
        res.json({ success: true, applications });
    } catch (error) {
        console.error('Applications error:', error.message);
        res.status(500).json({ success: false, message: 'Unable to load applications.' });
    }
});

app.get('/', sendPage('login.html'));
app.get('/index.html', sendPage('index.html'));
app.get('/login.html', sendPage('login.html'));
app.get('/register.html', sendPage('register.html'));
app.get('/dashboard.html', requirePageLogin, sendPage('dashboard.html'));
app.get('/fresher.html', requirePageLogin, sendPage('fresher.html'));
app.get('/experienced.html', requirePageLogin, sendPage('experienced.html'));
app.get('/profile.html', requirePageLogin, sendPage('profile.html'));
app.get('/applications.html', requirePageLogin, sendPage('applications.html'));
app.use(express.static(publicDirectory));

async function startServer() {
    try {
        await db.query('SELECT 1');
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error.message);
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log('=================================');
        console.log('IT WORK PORTAL');
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('=================================');
    });
}

if (require.main === module) {
    startServer();
}

function shutdown(signal) {
    console.log(`${signal} received. Closing database pool.`);
    db.end().finally(() => process.exit(0));
}

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));

module.exports = app;