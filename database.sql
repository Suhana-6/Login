CREATE DATABASE IF NOT EXISTS it_work_portal;
USE it_work_portal;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    location VARCHAR(150),
    qualification VARCHAR(150),
    skills TEXT,
    work_type VARCHAR(80),
    experience VARCHAR(80),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    work_type VARCHAR(100) NOT NULL,
    experience_type VARCHAR(50) NOT NULL,
    qualification VARCHAR(150),
    phone VARCHAR(30),
    location VARCHAR(150),
    skills TEXT,
    experience_years DECIMAL(4,1) DEFAULT 0,
    company_name VARCHAR(150),
    designation VARCHAR(150),
    expected_salary VARCHAR(80),
    work_mode VARCHAR(40),
    resume VARCHAR(255),
    extra_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_work_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    work_type VARCHAR(100) NOT NULL,
    experience_type VARCHAR(50) NOT NULL DEFAULT 'Fresher',
    application_status VARCHAR(40) NOT NULL DEFAULT 'Submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_application_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);