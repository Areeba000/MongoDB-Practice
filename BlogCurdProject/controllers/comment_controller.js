const Comment = require('../model/comment');
const Blog = require('../model/blog');
const User = require('../model/user');
const mongoose = require('mongoose');

const commentCheck = {
    checkallComment: async (req, res, next) => {
        try {
            const comments = await Comment.find();
            res.json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }

    },
    createcomment: async (req, res, next) => {
        try {
            const { text, blogId, userId } = req.body;
            // Check if userId and blogId are valid ObjectId formats
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: 'Invalid userId  format' });
            }
            if (!mongoose.Types.ObjectId.isValid(blogId)) {
                return res.status(400).json({ error: 'Invalid   blogId format' });
            }
            // Check if the blog and user exist in the database
            const blogExists = await Blog.exists({ _id: blogId });
            if (!blogExists) {
                return res.status(404).json({ message: 'Blog not found in the database' });
            }
            // Check if the user exists (based on your comment)
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                return res.status(400).json({ error: 'User not found' });
            }

            const commentBody = { text, blogId, userId };
            const comment = await Comment.create(commentBody);

            res.status(201).json({ message: 'Comment created successfully', comment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    checkCommentbyId: async (req, res, next) => {
        try {
            const { commentId } = req.params;

            // Check if commentId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(commentId)) {
                return res.status(400).json({ error: 'Invalid commentId format' });
            }

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            // If you need to find the user related to this comment
            const existingUser = await User.findById(comment.userId);

            if (!existingUser) {
                return res.status(400).json({ error: 'User not found' });
            }

            res.json(comment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }


    },
    updatecomment: async (req, res, next) => {
        try {
            const { text } = req.body;
            const { commentId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(commentId)) {
                return res.status(400).json({ error: 'Invalid commentId format' });
            }

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            const updatedComment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
            if (!updatedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.json({ message: 'Comment updated successfully', comment: updatedComment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    deletecomment: async (req, res, next) => {
        try {
            const { commentId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(commentId)) {
                return res.status(400).json({ error: 'Invalid commentId format' });
            }

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            const deletedComment = await Comment.findByIdAndDelete(commentId);
            if (!deletedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
module.exports = commentCheck;