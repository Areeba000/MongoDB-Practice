// user_routes.js
const express = require('express');
const User = require('../model/user');
const { userCheck, verifyToken } = require('../controllers/user_controller');

const router = express.Router();


router.get("/allUser", userCheck.getAllUser);
router.post("/signup", userCheck.signUp);
router.post("/login", userCheck.logIn);
router.delete("/deleteuser/:userId", userCheck.deleteUser);
router.get("/getbyId/:userId", userCheck.getUserById);
router.put("/updateuser/:userId", userCheck.userUpdateById);
router.get("/getuserprofile", verifyToken, userCheck.getProfileOfUser);

module.exports = router;
