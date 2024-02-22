const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/addstudent', studentController.addStudent);
router.delete('/deletestudent', studentController.deleteStudent);
router.get('/findStudent', studentController.findStudent);
router.post('/updateStudent', studentController.updateStudent);
module.exports = router;
