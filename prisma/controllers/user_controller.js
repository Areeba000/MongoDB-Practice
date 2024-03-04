const prisma = require("../prisma/prisma.config")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!\/])[a-zA-Z0-9!\/]{8,}$/;
    return passwordRegex.test(password);
}

const userCheck = {
    getAllUsers: async (req, res, next) => {
        try {
            const users = await prisma.user.findMany();

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

            const existingUser = await prisma.user.findFirst({
                where: { email: email }
            });

            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            if (!isValidEmail(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            if (!isValidPassword(password)) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters long, contain one capital letter, and one special character (slash)!",
                });
            }

            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(password, saltRounds);

            const createUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                }
            });

            return res.status(201).json({ user: createUser });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    logIn: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const existingUser = await prisma.user.findFirst({
                where: { email: email }
            });

            if (!existingUser) {
                return res.status(400).json({ message: "Could not find user by this Email" });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Incorrect password" });
            }

            const token = jwt.sign(
                { userId: existingUser.id, email: existingUser.email, username: existingUser.username },
                secretKey,
                { expiresIn: '1hour' }
            );

            return res.status(200).json({ message: "Login successful", token });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        };
    },

    deleteUser: async (req, res, next) => {
        try {
            const userId = req.params.userId;

            if (!userId) {
                return res.status(400).json({ error: 'Invalid userId format' });
            }

            const userToDelete = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!userToDelete) {
                return res.status(404).json({ message: "User not found" });
            }

            const deletedUser = await prisma.user.delete({
                where: { id: userId }
            });

            return res.status(200).json({ message: "User deleted successfully", deletedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const userId = req.params.userId;

            if (!userId) {
                return res.status(400).json({ error: 'Invalid userId format' });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

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
            const userId = req.params.userId;

            if (!userId) {
                return res.status(400).json({ error: 'Invalid userId format' });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const { username, email, password } = req.body;

            if (email && !isValidEmail(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            if (password && !isValidPassword(password)) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters long, contain one capital letter, and one special character (slash)!",
                });
            }

            if (username) {
                user.username = username;
            }

            if (email) {
                user.email = email;
            }

            if (password) {
                const saltRounds = 10;
                user.password = bcrypt.hashSync(password, saltRounds);
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    username: user.username,
                    email: user.email,
                    password: user.password,
                }
            });

            return res.status(200).json({ message: "User updated successfully", user: updatedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    getProfileOfUser: async (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized - Invalid or missing token' });
            }

            return res.status(200).json({
                userId: user.userId,
                username: user.username,
                email: user.email,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = { userCheck, verifyToken };
