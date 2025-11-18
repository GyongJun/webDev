    const express = require('express');
    const router = express.Router();
    const authMiddleWare = require('../MiddleWares/auth');
    const completePostValidation = require('../MiddleWares/postValidation').completePostValidation;

    const createPost = require('../controllers/post').createPost;
    const postView = require('../controllers/post').postView;
    const updatePost = require('../controllers/post').updatePost;
    const deletePost = require('../controllers/post').deletePost;

    const addLike = require('../controllers/post').addLike;
    const addDislike = require('../controllers/post').addDislike;

    const commentView = require('../controllers/post').commentView;
    const commentSend = require('../controllers/post').commentSend;
    const commentDelete = require('../controllers/post').commentDelete;


    router.get('/', postView);
    router.post('/', authMiddleWare, createPost);
    router.put('/:id', authMiddleWare, updatePost);
    router.delete('/:id', authMiddleWare, deletePost);
    
    router.post('/:postId/like', authMiddleWare, addLike);
    router.post('/:postId/dislike', authMiddleWare, addDislike);

    router.get('/comment/:id', commentView);
    router.post('/comment/:id', authMiddleWare, completePostValidation, commentSend);
    router.delete('/comment/:postId/:commentId', authMiddleWare, commentDelete);

    module.exports = router;