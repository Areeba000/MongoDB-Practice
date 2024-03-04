const express = require('express');
const blogCheck = require('../controllers/blog_controller');
//const { PrismaClient } = require('../prisma/generated/client');

const prisma = require("../prisma/prisma.config")
const blogRouter = express.Router();

blogRouter.get('/allblogs', blogCheck.getAllBlogs);
blogRouter.post('/addblogs', blogCheck.addBlog);
blogRouter.put('/updateblog/:id', blogCheck.updateBlog);
blogRouter.get('/getblog/:id', blogCheck.getBlogById);
blogRouter.delete('/deleteblog/:id', blogCheck.deleteBlogById);

module.exports = blogRouter;
