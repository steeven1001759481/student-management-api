const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes
app.get('/', (req,res)=>{
    res.json("Connected");
})
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);

// Connect to MongoDB
mongoose.connect(
    process.env.MONGODB_URI
)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error: ', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});