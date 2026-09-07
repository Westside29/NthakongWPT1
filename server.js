const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }

  console.log("Connected to MySQL database!");
});

// GET all students
app.get("/api/students", (req, res) => {
  const sql = "SELECT * FROM students";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Could not retrieve students."
      });
    }

    res.json(results);
  });
});

// ADD student
app.post("/api/students", (req, res) => {
  const { studentNumber, studentName, status } = req.body;

  const sql = `
    INSERT INTO students
    (student_number, student_name, status)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [studentNumber, studentName, status],
    (err, result) => {
      if (err) {
        return res.status(400).json({
          message: err.code === "ER_DUP_ENTRY"
            ? "Student number already exists."
            : "Could not insert student."
        });
      }

      res.status(201).json({
        message: "Student inserted successfully."
      });
    }
  );
});

// UPDATE student
app.put("/api/students/:studentNumber", (req, res) => {
  const oldStudentNumber = req.params.studentNumber;
  const { studentName, status } = req.body;

  const sql = `
    UPDATE students
    SET student_name = ?, status = ?
    WHERE student_number = ?
  `;

  db.query(
    sql,
    [studentName, status, oldStudentNumber],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Could not update student."
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Student not found."
        });
      }

      res.json({
        message: "Student updated successfully."
      });
    }
  );
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});