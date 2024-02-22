const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/school');

// Define a Mongoose schema
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    grade: String,
});

// Create a Mongoose model
const Student = mongoose.model('Student', studentSchema);

app.get('/addstudent', async (req, res) => {
    try {
        // Use find to retrieve all students from the database
        const allStudents = await Student.find();
        // Use findOne to find a student with age equal to 19
        const savedStudents = await Student.findOne({ age: 19 });

        res.json(savedStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
