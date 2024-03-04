const prisma = require('../prisma/prisma.config');

const commentCheck = {
    checkallComment: async (req, res, next) => {
        try {
            const comments = await prisma.comment.findMany();
            res.json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }

    },
    createcomment: async (req, res, next) => {
        try {
            const { text, blogId, userId } = req.body;

            // Check if the blog and user exist in the database
            const blogExists = await prisma.blog.findUnique({ where: { id: blogId } });
            if (!blogExists) {
                return res.status(404).json({ message: 'Blog not found in the database' });
            }

            // Check if the user exists
            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
            if (!existingUser) {
                return res.status(400).json({ error: 'User not found' });
            }

            const comment = await prisma.comment.create({
                data: { text, blogId, userId }
            });

            res.status(201).json({ message: 'Comment created successfully', comment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    checkCommentbyId: async (req, res, next) => {
        try {
            const { commentId } = req.params;

            // Check if commentId is a valid UUID
            if (!commentId || typeof commentId !== 'string') {
                return res.status(400).json({ error: 'Invalid commentId format' });
            }

            const comment = await prisma.comment.findFirst({
                where: { id: commentId },
                include: { user: true }
            });

            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
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

            // Check if commentId is a valid UUID
            if (!commentId || typeof commentId !== 'string') {
                return res.status(400).json({ error: 'Invalid commentId format' });
            }

            const updatedComment = await prisma.comment.update({
                where: { id: commentId },
                data: { text },
            });

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

            // Check if commentId is a valid UUID
            if (!commentId || typeof commentId !== 'string') {
                return res.status(400).json({ error: 'Invalid commentId format' });
            }

            const deletedComment = await prisma.comment.delete({
                where: { id: commentId }
            });

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

