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

app.delete('/addstudent', async (req, res) => {
    try {
        const deleteCriteria = { name: 'John Doe' };

        // Use deleteOne to delete a single student from the database
        const deletedStudent = await Student.deleteOne(deleteCriteria);
        res.json(deletedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
