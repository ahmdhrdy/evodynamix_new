CREATE DATABASE evodynamix_db;
USE evodynamix_db;

-- Admins table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Projects table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    items JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact submissions table
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quote requests table
CREATE TABLE quote_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    budget VARCHAR(50) NOT NULL,
    timeline ENUM('Monthly', 'Yearly', 'DayByDay') NOT NULL,
    application_type ENUM('Android', 'DesktopPC', 'IOS', 'Web') NOT NULL,
    email VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Insert default admin (password should be hashed in production)
INSERT INTO admins (username, password, email) VALUES ('admin', 'hashed_password_here', 'admin@evodynamix.com');