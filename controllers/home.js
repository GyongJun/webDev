const fs = require('fs');
const multiparty = require('multiparty');

uploadDir = 'public/img/uploads';

exports.index = (req, res) => {
    res.render('index');
}

exports.registerView = (req, res) => {
    res.render('register');
}

exports.login = (req, res) => {
    res.render('login');
}

exports.register = (req, res) => {
    alert(__dirname);
}

