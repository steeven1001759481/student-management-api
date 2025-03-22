const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const Task = require('../models/task');
const authMiddleware = require('../middleware/auth');
const dotenv = require('dotenv');

dotenv.config();

// Student Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).send('Student not found');

    const isMatch = password === student.password;
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: student._id }, process.env.STUDENT_SECRET);
    res.json({ token });
});

// // Get student details
// router.get('/details', authMiddleware.studentAuth, async (req, res) => {
//     const studentId = req.student.id;
//     const student = await Student.findById(studentId);
//     if (!student) return res.status(400).send('Student not found');

//     res.json(student);
// });

// Get assigned tasks for the student
router.get('/tasks', authMiddleware.studentAuth, async (req, res) => {
    const studentId = req.student.id;
    const student = await Student.findById(studentId).populate('tasks');

    res.json({
        Name: student.name,
        tasks: student.tasks,
    });
});

// Mark task as completed or pending
router.patch('/tasks/:taskId', authMiddleware.studentAuth, async (req, res) => {
    const studentId = req.student.id;
    const { status } = req.body;
    const task = await Task.findById(req.params.taskId);

    if (!task || task.assignedTo.toString() !== studentId) {
        return res.status(403).send('Task not assigned to this student');
    }

    task.status = status;
    await task.save();

    res.json(task);
});

module.exports = router;