const express = require('express');
const { userCheck, verifyToken } = require('../controllers/user_controller');


const prisma = require("../prisma/prisma.config")
const router = express.Router();

router.get("/allUser", userCheck.getAllUsers);
router.post("/signup", userCheck.signUp);
router.post("/login", userCheck.logIn);
router.delete("/deleteuser/:userId", userCheck.deleteUser);
router.get("/getbyId/:userId", userCheck.getUserById);
router.put("/updateuser/:userId", userCheck.userUpdateById);
router.get("/getuserprofile", verifyToken, userCheck.getProfileOfUser);

module.exports = router;
