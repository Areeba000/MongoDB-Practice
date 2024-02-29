const mongoose = require('mongoose');
const Blog = require('../model/blog');
const User = require('../model/user');
const Comment = require('../model/comment');


const blogCheck = {
    getAllBlogs: async (req, res, next) => {

        try {
            const blogs = await Blog.find({}).populate('userId');

            if (!blogs.length) {
                return res.status(404).json({ message: "No blogs found", blogs });
            }

            for (let blog of blogs) {

                const comments = await Comment.find({ blogId: blog._id });

                blog._doc.commet = comments;
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
            const blog = {
                title,
                description,
                image,
                userId,
            };
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: 'Invalid blogId format' });
            }
            const existingUser = await User.findById(userId);

            if (!existingUser) {
                return res.status(400).json({ error: 'User not found' });
            }



            await Blog.create(blog)
            return res.status(200).json({ blog })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    updateBlog: async (req, res, next) => {
        try {
            const { title, description } = req.body;
            const blogId = req.params.id;

            // Validate the blogId format
            if (!mongoose.Types.ObjectId.isValid(blogId)) {
                return res.status(400).json({ error: 'Invalid blogId format' });
            }

            // Check if the blog exists
            const existingBlog = await Blog.findById(blogId);
            if (!existingBlog) {
                return res.status(404).json({ error: 'Blog not found' });
            }

            // Update the blog
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
                title,
                description
            }, { new: true }); // { new: true } returns the updated document

            return res.status(200).json({ blog: updatedBlog });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    getBlogById: async (req, res, next) => {

        try {
            const blogId = req.params.id;

            // Check if the blogId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(blogId)) {
                return res.status(400).json({ message: "Invalid blogId format" });
            }

            // Attempt to find the blog
            const blog = await Blog.findById(blogId).populate('userId');

            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
            const comments = await Comment.find({ blogId: blog._id });

            blog._doc.commet = comments;

            return res.status(200).json({ blog });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

    },
    deleteBlogById: async (req, res, next) => {
        try {
            const blogId = req.params.id;

            // Validate the blogId format
            if (!mongoose.Types.ObjectId.isValid(blogId)) {
                return res.status(400).json({ error: 'Invalid blogId format' });
            }

            // Check if the blog exists
            const existingBlog = await Blog.findById(blogId);
            if (!existingBlog) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            await Comment.deleteMany({ blogId: blogId });
            // Delete the blog
            const deletedBlog = await Blog.findByIdAndDelete(blogId);

            return res.status(200).json({ message: "Blog deleted successfully", deletedBlog });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

};

module.exports = blogCheck;
