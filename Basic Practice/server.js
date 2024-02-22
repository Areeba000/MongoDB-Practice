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

app.post('/addstudent', async (req, res) => {
    try {
        // Create an array of new students
        const newStudents = [
            {
                name: 'John Doe',
                age: 20,
                grade: 'A',
            },
            {
                name: 'Jane Smith',
                age: 22,
                grade: 'B',
            },
            {
                name: 'abc',
                age: 19,
                grade: 'B',
            },
        ];

        // Use insertMany to save multiple students to the database
        const savedStudents = await Student.insertMany(newStudents);

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
