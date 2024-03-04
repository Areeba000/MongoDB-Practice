const express = require('express');
const commentCheck = require('../controllers/comment_controller');

const prisma = require("../prisma/prisma.config")
const commentRouter = express.Router();

commentRouter.get('/checkallcomment', commentCheck.checkallComment);
commentRouter.post('/createcomment', commentCheck.createcomment);
commentRouter.get('/checkcommentbyId/:commentId', commentCheck.checkCommentbyId);
commentRouter.put('/updatecomment/:commentId', commentCheck.updatecomment);
commentRouter.delete('/deletecomment/:commentId', commentCheck.deletecomment);

module.exports = commentRouter;
