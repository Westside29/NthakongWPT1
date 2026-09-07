CREATE DATABASE IF NOT EXISTS student_attendance;

USE student_attendance;

CREATE TABLE IF NOT EXISTS students (
    student_number INT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL
);

INSERT INTO students (student_number, student_name, status)
VALUES
    (20, 'Tebogo', 'Present'),
    (12, 'Relebohile', 'Present'),
    (80, 'Ntsoaki', 'Absent'),
    (73, 'Reaboka', 'Present')
ON DUPLICATE KEY UPDATE
    student_name = VALUES(student_name),
    status = VALUES(status);

SELECT * FROM students;