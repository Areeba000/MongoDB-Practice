const express = require('express');
const Comment = require('../model/comment');
const commentCheck = require('../controllers/comment_controller');

const commentrouter = express.Router();
commentrouter.get('/checkallcomment', commentCheck.checkallComment);
commentrouter.post('/createcomment', commentCheck.createcomment);
commentrouter.get('/checkcommentbyId/:commentId', commentCheck.checkCommentbyId);
commentrouter.put('/updatecomment/:commentId', commentCheck.updatecomment);
commentrouter.delete('/deletecomment/:commentId', commentCheck.deletecomment);


module.exports = commentrouter;