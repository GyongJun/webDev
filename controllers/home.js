const fs = require('fs');
const multiparty = require('multiparty');
const path = require('path');

const uploadDir = require('../config/key').uploadDir;

const userModel = require('../models/User')
const bcrypt = require('bcryptjs');


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
        if(files && files.character && files.character.length > 0) {
            const uploadedFile = files.character[0];
            
            const nowDate = new Date();
            const newFileName = nowDate.getTime() + path.extname(uploadedFile.originalFilename);
            console.log(newFileName);
            const newFilePath = path.join(newUploadDir, newFileName.toString());

            fs.rename(uploadedFile.path, newFilePath, function(err) {
                if (err) {
                    return res.json(err);
                }
            });

            const newUser = new User({
                name : fields.name[0],
                email : fields.email[0],
                character : newFileName,
                password : fields.password[0]
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) return res.json(err);

                    newUser.password = hash;

                    newUser.save ()
                        .then(user => res.json(user))
                        .catch(err => res.json(err));
                });
            });
        } 
        else {
            let response = {
                message : 'Select your File'
            };
            res.json(response);
        }
    });
}

