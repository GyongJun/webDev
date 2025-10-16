const fs = require('fs');
const multiparty = require('multiparty');
const path = require('path');

const uploadDir = '../public/img/uploads';

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
    // const newUploadDir = __dirname + "/.." + uploadDir;
    const newUploadDir = path.join(__dirname, uploadDir);
    const form = new multiparty.Form({uploadDir: newUploadDir});

    form.parse(req, (err, fields, files) => {
        if(err)
            console.log(err);
        if(files) {
            const uploadFile = files.character[0];
            
            const nowDate = new Date();
            const newFileName = nowDate.getTime();
            const newFilePath = path.join(newUploadDir, newFileName.toString());
            console.log(uploadFile.path);
            console.log(newFilePath);
        }
    });
}

