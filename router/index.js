const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home1');

router.get('/', homeController.index);
router.get('/register', homeController.registerView);
router.get('/login', homeController.login);
router.post('/register', homeController.register);


module.exports = router;