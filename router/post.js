const express = require('express');
const router = express.Router();
const authMiddleWare = require('../MiddleWares/auth');

const createPost = require('../controllers/post').createPost;
const viewPost = require('../controllers/post').viewPost;
const updatePost = require('../controllers/post').updatePost;
const deletePost = require('../controllers/post').deletePost;

router.get('/', viewPost);
router.post('/', authMiddleWare, createPost);
router.put('/:id', authMiddleWare, updatePost);
router.delete('/:id', authMiddleWare, deletePost);

module.exports = router;