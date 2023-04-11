DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;
CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL
);
CREATE TABLE role (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department (id) ON DELETE CASCADE
);
 CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee (id) ON DELETE SET NULL
 )