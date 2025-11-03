const express = require('express');
const router = express.Router();
const authMiddleWare = require('../MiddleWares/auth');

const createPost = require('../controllers/post').createPost;
const postView = require('../controllers/post').postView;
const updatePost = require('../controllers/post').updatePost;
const deletePost = require('../controllers/post').deletePost;

const commentView = require('../controllers/post').commentView;
const commentSend = require('../controllers/post').commentSend;

router.get('/', postView);
router.post('/', authMiddleWare, createPost);
router.put('/:id', authMiddleWare, updatePost);
router.delete('/:id', authMiddleWare, deletePost);

router.get('/comment/:id', commentView);
router.get

module.exports = router;