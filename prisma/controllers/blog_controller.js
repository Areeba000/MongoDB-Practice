const prisma = require("../prisma/prisma.config")

const blogCheck = {
    getAllBlogs: async (req, res, next) => {
        try {
            const blogs = await prisma.blog.findMany({ include: { user: true, comments: true } });

            if (!blogs.length) {
                return res.status(404).json({ message: "No blogs found", blogs });
            }

            return res.status(200).json({ blogs });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    addBlog: async (req, res, next) => {
        try {
            const { title, description, image, userId } = req.body;

            if (!userId || typeof userId !== 'string') {
                return res.status(400).json({ error: 'Invalid userId format' });
            }

            const existingUser = await prisma.user.findFirst({ where: { id: userId } });

            if (!existingUser) {
                return res.status(400).json({ error: 'User not found' });
            }

            const blog = await prisma.blog.create({
                data: {
                    title,
                    description,
                    image,
                    user: { connect: { id: userId } },
                }
            });

            return res.status(200).json({ blog });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    updateBlog: async (req, res, next) => {
        try {
            const { title, description } = req.body;
            const blogId = req.params.id;

            if (!blogId || typeof blogId !== 'string') {
                return res.status(400).json({ error: 'Invalid blogId format' });
            }

            const existingBlog = await prisma.blog.findFirst({ where: { id: blogId } });

            if (!existingBlog) {
                return res.status(404).json({ error: 'Blog not found' });
            }

            const updatedBlog = await prisma.blog.update({
                where: { id: blogId },
                data: { title, description }
            });

            return res.status(200).json({ blog: updatedBlog });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    getBlogById: async (req, res, next) => {
        try {
            const blogId = req.params.id;

            if (!blogId || typeof blogId !== 'string') {
                return res.status(400).json({ message: "Invalid blogId format" });
            }


            const blog = await prisma.blog.findFirst({
                where: { id: blogId },
                include: { user: true, comments: true }
            });

            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }

            return res.status(200).json({ blog });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    deleteBlogById: async (req, res, next) => {
        try {
            const blogId = req.params.id;

            if (!blogId || typeof blogId !== 'string') {
                return res.status(400).json({ message: "Invalid blogId format" });
            }


            const existingBlog = await prisma.blog.findFirst({ where: { id: blogId } });

            if (!existingBlog) {
                return res.status(404).json({ error: 'Blog not found' });
            }

            await prisma.comment.deleteMany({ where: { blogId: blogId } });

            const deletedBlog = await prisma.blog.delete({ where: { id: blogId } });

            return res.status(200).json({ message: "Blog deleted successfully", deletedBlog });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

module.exports = blogCheck;
