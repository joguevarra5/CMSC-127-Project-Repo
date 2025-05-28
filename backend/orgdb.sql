-- set-up database
DROP DATABASE IF EXISTS orgdb;
CREATE DATABASE orgdb;
-- set-up users and privileges
DROP USER IF EXISTS 'orgadmin'@'localhost';
CREATE USER 'orgadmin'@'localhost' IDENTIFIED BY 'useruser';

DROP USER IF EXISTS 'orgmember'@'localhost';
CREATE USER 'orgmember'@'localhost' IDENTIFIED BY 'useruser';

GRANT ALL PRIVILEGES ON orgdb.* TO 'orgadmin'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON orgdb.* TO 'orgmember'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('global_admin', 'org_admin', 'student') NOT NULL
);

GRANT SELECT,
    INSERT,
    DELETE,
    UPDATE ON orgdb.* TO 'orgmember'@'localhost';
-- use orgdb database
USE orgdb;
-- set-up org table
CREATE TABLE org (
    org_id INT PRIMARY KEY,
    org_name VARCHAR(30) NOT NULL,
    classification ENUM('Academic', 'Non-Academic', 'Varsitarian') NOT NULL
);
-- set-up student table
CREATE TABLE student (
    student_id VARCHAR(10) PRIMARY KEY,
    fname VARCHAR(30) NOT NULL,
    mname VARCHAR(30),
    lname VARCHAR(30) NOT NULL,
    degprog VARCHAR(30) NOT NULL,
    gender ENUM('Male', 'Female'),
    graduation_date DATE
);
-- set-up org_mem table
CREATE TABLE org_mem (
    org_id INT,
    student_id VARCHAR(10),
    join_date DATE NOT NULL,
    status ENUM(
        'Active',
        'Inactive',
        'Suspended',
        'Expelled',
        'Alumni'
    ) NOT NULL,
    position VARCHAR(30),
    assignment_date DATE,
    committee VARCHAR(30),
    PRIMARY KEY (org_id, student_id),
    FOREIGN KEY (org_id) REFERENCES org(org_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);
-- set-up fee table
CREATE TABLE fee (
    transaction_id INT PRIMARY KEY,
    deadline_date DATE NOT NULL,
    payment_date DATE,
    payment_status ENUM('Paid', 'Pending') DEFAULT 'Pending',
    amount INT NOT NULL,
    student_id VARCHAR(10),
    org_id INT,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (org_id) REFERENCES org(org_id)
); 

-- populating the database

-- Users
INSERT INTO users (username, password, role) VALUES 
('admin', 'adminuser', 'global_admin'),
('orgadmin', 'orgadminuser', 'org_admin'),
('student1', 'studentuser', 'student');

-- Organizations
INSERT INTO org VALUES
(1, 'UPLB MASS', 'Academic'),
(2, 'ACSS UPLB', 'Academic'),
(3, 'UPLB Cats and Dogs', 'Non-Academic'),
(4, 'Bay Baes', 'Varsitarian'),
(5, 'UPLB Samasama', 'Non-Academic'),
(6, 'UPLB ComSoc', 'Academic'),
(7, 'UP Kustura', 'Varsitarian'),
(8, 'UPLB Tanghalan', 'Non-Academic');

-- Students
INSERT INTO student VALUES
('202265088', 'Aldrey Mori', 'A', 'Limbaco', 'BS Statistics', 'Male', NULL),
('202327501', 'Joella', 'L', 'Elindo', 'BS Computer Science', 'Female', NULL),
('202312345', 'Joy Christine Laura', 'O', 'Guevarra', 'BS Computer Science', 'Female', NULL),
('202200001', 'Juan', 'P', 'Dela Cruz', 'BS Biology', 'Male', NULL),
('202099992', 'Chappell', NULL, 'Roan', 'BA Communication Arts', 'Female', '2023-07-30'),
('202312340', 'Andrea', 'M', 'Soriano', 'BS Development Communication', 'Female', NULL),
('202411112', 'Miguel', 'D', 'Valmoria', 'BS Forestry', 'Male', NULL),
('202234567', 'Carlos', 'J', 'Aguila', 'BS Agricultural Economics', 'Male', NULL),
('202255555', 'Leah', 'R', 'Espino', 'BS Chemical Engineering', 'Female', NULL),
('202133333', 'Reese', NULL, 'Gonzales', 'BS Human Ecology', 'Female', '2024-06-15'),
('202566789', 'Marvin', 'G', 'Ilagan', 'BS Agribusiness Management', 'Male', NULL),
('202477777', 'Eliza', 'F', 'Padua', 'BS Nutrition', 'Female', NULL);

-- Org Members
INSERT INTO org_mem VALUES
(1, '202265088', '2024-10-16', 'Active', NULL, NULL, 'Finance'),
(2, '202327501', '2025-05-03', 'Active', NULL, NULL, 'Publication and Marketing'),
(2, '202312345', '2025-05-03', 'Active', NULL, NULL, 'Documentation and Records'),
(3, '202327501', '2025-03-12', 'Active', 'Creatives Head', '2025-04-01', 'Creatives'),
(4, '202200001', '2022-10-28', 'Active', 'President', '2023-05-20', 'Internals'),
(4, '202099992', '2021-11-09', 'Alumni', 'President', '2022-05-15', 'Externals'),
(4, '202327501', '2023-10-27', 'Inactive', NULL, NULL, 'Internals'),
(5, '202312340', '2024-08-12', 'Active', 'VP for Logistics', '2025-01-15', 'Logistics'),
(6, '202411112', '2025-01-20', 'Active', 'Secretary', '2025-03-01', 'Secretariat'),
(6, '202312345', '2025-01-22', 'Active', NULL, NULL, 'Public Relations'),
(7, '202234567', '2023-09-09', 'Suspended', NULL, NULL, 'Culture'),
(7, '202255555', '2024-02-05', 'Active', 'Chairperson', '2024-06-01', 'Admin'),
(8, '202133333', '2021-08-18', 'Alumni', 'Treasurer', '2022-01-01', 'Finance'),
(5, '202566789', '2025-03-10', 'Active', 'Auditor', '2025-03-20', 'Finance'),
(3, '202477777', '2025-02-01', 'Active', NULL, NULL, 'Animal Welfare');

-- Fees
INSERT INTO fee VALUES
(24250132, '2025-05-23', '2025-05-03', 'Paid', 500, '202327501', 3),
(24250201, '2023-12-01', NULL, 'Pending', 500, '202265088', 1),
(24250202, '2025-06-15', NULL, 'Pending', 300, '202312340', 5),
(24250203, '2025-06-20', '2025-06-10', 'Paid', 500, '202411112', 6),
(24250204, '2024-11-15', '2024-11-10', 'Paid', 500, '202255555', 7),
(24250205, '2025-01-10', NULL, 'Pending', 450, '202234567', 7),
(24250206, '2023-10-30', '2023-10-29', 'Paid', 500, '202133333', 8),
(24250207, '2025-06-30', NULL, 'Pending', 350, '202566789', 5),
(24250208, '2025-04-15', '2025-04-10', 'Paid', 500, '202477777', 3),
(24250209, '2025-07-10', NULL, 'Pending', 400, '202312345', 2),
(24250210, '2025-08-01', '2025-07-30', 'Paid', 600, '202477777', 1),
(24250211, '2025-08-15', NULL, 'Pending', 500, '202255555', 5),
(24250212, '2025-09-01', '2025-08-25', 'Paid', 350, '202265088', 1),
(24250213, '2025-09-10', NULL, 'Pending', 500, '202327501', 2),
(24250214, '2025-09-15', '2025-09-10', 'Paid', 450, '202312345', 6),
(24250215, '2025-07-01', NULL, 'Pending', 400, '202200001', 4),
(24250216, '2025-12-01', '2025-11-20', 'Paid', 300, '202200001', 4),
(24250217, '2024-08-01', '2024-07-20', 'Paid', 500, '202099992', 4),
(24250218, '2025-01-01', NULL, 'Pending', 400, '202099992', 4),
(24250219, '2025-09-20', '2025-09-15', 'Paid', 250, '202312340', 5),
(24250220, '2025-10-01', NULL, 'Pending', 600, '202411112', 6),
(24250221, '2025-09-25', '2025-09-24', 'Paid', 300, '202234567', 7),
(24250222, '2025-10-10', NULL, 'Pending', 550, '202255555', 7),
(24250223, '2025-11-01', '2025-10-28', 'Paid', 500, '202133333', 8),
(24250224, '2025-11-15', NULL, 'Pending', 450, '202566789', 5);