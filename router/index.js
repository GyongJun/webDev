const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home');

router.get('/', homeController.index);
router.get('/login', homeController.login);
router.get('/register', homeController.registerView);

module.exports = router;