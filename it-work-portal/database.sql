CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  qualification VARCHAR(150),
  college VARCHAR(200),
  graduation_year VARCHAR(20),
  job_role VARCHAR(150),
  skills TEXT,
  preferred_location VARCHAR(150),
  preferred_work VARCHAR(100),
  work_type VARCHAR(100),
  resume TEXT,
  years_of_experience VARCHAR(50),
  current_company VARCHAR(150),
  previous_company VARCHAR(150),
  current_designation VARCHAR(150),
  expected_salary VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
