const Student = require('../models/studentmodel');

const studentController = {
    addStudent: async (req, res) => {
        try {
            const newStudent = new Student({
                name: 'John Doe',
                age: 20,
                grade: 'A',
            });

            const savedStudent = await newStudent.save();
            res.json(savedStudent);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteStudent: async (req, res) => {
        try {
            const deleteCriteria = { name: 'John Doe' };
            const deletedStudent = await Student.deleteOne(deleteCriteria);
            res.json(deletedStudent);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    findStudent: async (req, res) => {
        try {
            const allStudents = await Student.find();
            res.json(allStudents);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateStudent: async (req, res) => {
        try {
            const updateCriteria = { name: 'abc' };

            // Define the update operation (e.g., setting the grade to 'A')
            const updateOperation = { $set: { name: 'Areeba' } };

            // Use updateMany to update multiple students in the database
            const updatedStudents = await Student.updateMany(updateCriteria, updateOperation);


            res.json(updatedStudents);
        } catch (error) {

        }
    }
};

module.exports = studentController;
