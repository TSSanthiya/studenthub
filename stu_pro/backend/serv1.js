const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Server Configuration
const PORT = process.env.SECOND_SERVER_PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/studenthub", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Student Schema
const studentSchema = new mongoose.Schema({
  rollno: String,
  registerno: String,
  studentname: String,
  dept: String,
  sec: String,
});
const Student = mongoose.model("studentdata", studentSchema, "studentdata");

// Define Faculty Schema (ID is both username and password)
const facultySchema = new mongoose.Schema({
  ID: { type: String, required: true }, // Faculty ID (also used as password)
});
const Faculty = mongoose.model("Faculty", facultySchema, "facultylogin");

// Student Login Route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find student by roll number
    const student = await Student.findOne({ rollno: username });
    if (!student) {
      return res.status(400).json({ success: false, message: "Invalid Roll Number" });
    }

    // Respond with student details
    res.json({
      success: true,
      role: "student",
      message: "Login successful",
      student: {
        rollno: student.rollno,
        registerno: student.registerno,
        name: student.studentname,
        dept: student.dept,
        sec: student.sec,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Faculty Login Route
app.post("/faculty-login", async (req, res) => {
  const { username, password } = req.body; // Using `username` for ID

  if (!username || !password) {
    return res.status(400).json({ message: "Please enter both ID and password" });
  }

  try {
    // Find faculty by `ID`
    const faculty = await Faculty.findOne({ ID: username });

    if (!faculty) {
      return res.status(404).json({ message: "User not found" });
    }

    // Since ID itself is the password, check if they match
    if (faculty.ID !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: faculty.ID }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      role: "faculty",
      message: "Login successful",
      token,
      faculty: {
        id: faculty.ID,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
