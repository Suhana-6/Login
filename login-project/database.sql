CREATE DATABASE IF NOT EXISTS login_system;
USE login_system;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password)
VALUES (
    'suhana',
    'suhana@gmail.com',
    '$2b$10$0Rq7jKJ3wGLj2vT1emNQAu6gVKOO/Gy.1g4Qjduv5I2nUZK9aUIg2'
)
ON DUPLICATE KEY UPDATE
    username = VALUES(username),
    email = VALUES(email),
    password = VALUES(password);

SELECT * FROM users;
