const express = require('express');
const router = express.Router();
const authMiddleWare = require('../MiddleWares/auth');
const createPost = require('../controllers/post').create;
const articleView = require('../controllers/post').articleView;
const updatePost = require('../controllers/post').updatePost;

router.get('/', articleView);
router.post('/', authMiddleWare, createPost);
router.put('/:id', authMiddleWare, updatePost);

module.exports = router;