const express = require('express');
const Blog = require('../model/blog');
const blogCheck = require('../controllers/blog_controller');

const blogrouter = express.Router();

blogrouter.get('/allblogs', blogCheck.getAllBlogs);
blogrouter.post('/addblogs', blogCheck.addBlog);
blogrouter.put('/updateblog/:id', blogCheck.updateBlog);
blogrouter.get('/getblog/:id', blogCheck.getBlogById);
blogrouter.delete('/deleteblog/:id', blogCheck.deleteBlogById);

module.exports = blogrouter;