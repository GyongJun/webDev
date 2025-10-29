const express = require('express');
const router = express.Router();

const validateMiddleWare = require('../MiddleWares/validate');
const validate = require('../validations/login');

const homeController = require('../controllers/home1');

router.get('/', homeController.index);
router.get('/register', homeController.registerView);
router.get('/login', homeController.loginView);
// router.get('/forum', homeController.forum);
router.get('/logOut', homeController.logout);

router.post('/register', homeController.register);
router.post('/login', validateMiddleWare(validate), homeController.login);



module.exports = router;