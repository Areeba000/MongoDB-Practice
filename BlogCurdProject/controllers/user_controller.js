const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const secretKey = '1234';
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        req.user = decoded;
        next();
    });

}

const userCheck = {
    getAllUser: async (req, res, next) => {

        try {
            const users = await User.find();


            if (!users || users.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }

            return res.status(200).json({ users });
        } catch (error) {
            console.error(error);

            return res.status(500).json({ message: "Internal Server Error" });

        }
    },

    signUp: async (req, res, next) => {

        try {
            const { username, email, password } = req.body;
            // Check if the email is unique
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            // Check if the email is in a valid format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            // Check password requirements
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!\/])[a-zA-Z0-9!\/]{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters long, contain one capital letter, and one special character (slash)!",
                });
            }


            const saltRounds = 10; // You can adjust this based on your security needs
            const salt = bcrypt.genSaltSync(saltRounds);

            const hashedpassword = bcrypt.hashSync(password, salt);

            const user = {
                username,
                email,
                password: hashedpassword,
            };
            const creatUser = await User.create(user);
            return res.status(201).json({ user: creatUser });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    logIn: async (req, res, next) => {

        try {
            const { email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(400).json({ message: "Could not find user by this Email" });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Incorrect password" });
            }

            const token = jwt.sign(
                { userId: existingUser._id, email: existingUser.email, username: existingUser.username },
                '1234',
                { expiresIn: '1hour' }  // Token expires in 1 hour, you can adjust this
            );

            return res.status(200).json({ message: "Login successful", token });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });

        };
    },
    deleteUser: async (req, res, next) => {
        try {
            // Assuming you pass the userId in the request parameters
            const userId = req.params.userId;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: 'Invalid blogId format' });
            }

            // Check if the user exists
            const userToDelete = await User.findById(userId);
            if (!userToDelete) {
                return res.status(404).json({ message: "User not found" });
            }

            // Implement user deletion logic using findOneAndDelete
            const deletedUser = await User.findOneAndDelete({ _id: userId });

            if (!deletedUser) {
                return res.status(500).json({ message: "Failed to delete user" });
            }

            return res.status(200).json({ message: "User deleted successfully", deletedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    getUserById: async (req, res, next) => {
        try {
            // Assuming you pass the userId in the request parameters
            const userId = req.params.userId;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: 'Invalid userId format' });
            }

            // Check if the user exists
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    userUpdateById: async (req, res, next) => {
        try {
            // Assuming you pass the userId in the request parameters
            const userId = req.params.userId;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: 'Invalid userId format' });
            }

            // Check if the user exists
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Extract update data from request body
            const { username, email, password } = req.body;

            // Check if the email is in a valid format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            // Check password requirements
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!\/])[a-zA-Z0-9!\/]{8,}$/;
            if (password && !passwordRegex.test(password)) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters long, contain one capital letter, and one special character (slash)!",
                });
            }

            // Update user data if provided in the request body
            if (username) {
                user.username = username;
            }

            if (email) {
                user.email = email;
            }
            if (password) {
                user.password = password;
            }

            // Save the updated user
            const updatedUser = await user.save();

            return res.status(200).json({ message: "User updated successfully", user: updatedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    getProfileOfUser: async (req, res, next) => {
        try {
            // Retrieve user information from the decoded JWT token
            const user = req.user;

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized - Invalid or missing token' });
            }

            // You can customize the response based on your user information
            return res.status(200).json({
                userId: user.userId,
                username: user.username,
                email: user.email,
                // Add other user information here
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }

    }
}

module.exports = { userCheck, verifyToken };

