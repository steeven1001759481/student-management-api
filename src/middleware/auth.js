const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Student = require('../models/student');
const dotenv = require('dotenv');

dotenv.config();


// Admin authentication
module.exports.adminAuth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied');

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin) return res.status(401).send('Access denied');
        req.admin = admin;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

// Student authentication
module.exports.studentAuth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied');

    try {
        const decoded = jwt.verify(token, process.env.STUDENT_SECRET);
        const student = await Student.findById(decoded.id);
        if (!student) return res.status(401).send('Access denied');
        req.student = student;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};