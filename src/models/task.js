const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'overdue'], default: 'pending' },
    dueDate: { type: Date, required: true}, 
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;