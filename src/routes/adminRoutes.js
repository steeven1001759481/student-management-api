const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Student = require('../models/student');
const Task = require('../models/task');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const dotenv = require('dotenv');

dotenv.config();


// Admin Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).send('Admin not found');

    const isMatch = password === admin.password;
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: admin._id }, process.env.ADMIN_SECRET);
    res.json({ token });
});

// Create student profile
router.post('/create-student', authMiddleware.adminAuth, async (req, res) => {
    const { name, email, department, password } = req.body;

    const newStudent = new Student({ name, email, department, password });
    await newStudent.save();
    res.json(newStudent);
});

// Assign task to student
router.post('/assign-task', authMiddleware.adminAuth, async (req, res) => {
    const { title, status, dueDate, studentName } = req.body;
    const student = await Student.findOne({ name: studentName });

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    const task = new Task({ title, status, dueDate, assignedTo: student._id });
    await task.save();

    student.tasks.push(task._id);
    await student.save();

    res.json(task);
});

module.exports = router;