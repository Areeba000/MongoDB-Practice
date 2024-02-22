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
        // Define the update criteria (e.g., updating students with grade 'B' to grade 'A')
        const updateCriteria = { grade: 'B' };

        // Define the update operation (e.g., setting the grade to 'A')
        const updateOperation = { $set: { grade: 'A' } };

        // Use updateMany to update multiple students in the database
        const updatedStudents = await Student.updateMany(updateCriteria, updateOperation);


        res.json(updatedStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
