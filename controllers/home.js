const fs = require('fs');
const multiparty = require('multiparty');
const path = require('path');

const express = require('express');



const uploadDir = require('../config/key').uploadDir;

const userModel = require('../models/User')
const bcrypt = require('bcryptjs');
const validateRegister = require('../validations/register');

exports.index = (req, res) => {
    res.render('index');
}

exports.registerView = (req, res) => {
    res.render('register');
}

exports.login = (req, res) => {
    res.render('login');
}


exports.forum = (req, res) => {
    res.render('forum');
}

exports.register = (req, res) => {
    // const newUploadDir = __dirname + "/.." + uploadDir;
    const newUploadDir = path.join(__dirname, uploadDir);

    const originalRefer = req.get('Referer');

exports.register = (req, res) => {
    // const newUploadDir = __dirname + "/.." + uploadDir;
    const newUploadDir = path.join(__dirname, uploadDir);

    
    const form = new multiparty.Form({uploadDir: newUploadDir});

    form.parse(req, (err, fields, files) => {

        
        if(err)
            return res.json(err);

        if(err)
            console.log(err);


        const data = {
            name : fields.name[0],
            email : fields.email[0],
            password : fields.password[0],
            password2 : fields.password2[0]
        };


        User.findOne({email : data.email})
            .then(user => {
                if(user) {
                    req.flash("email", 'The email is already associated with an account');
                    if (originalRefer) {
                        return res.redirect(originalRefer);
                    }
                }
                const {errors, isValid} = validateRegister(data);

                if(!isValid) {
                    if (errors.name) {
                        req.flash("name", errors.name);
                    }

                    if(errors.email) {
                        req.flash("email", errors.email);
                    }

                    if(errors.password) {
                        req.flash("password", errors.password);
                    }
                    
                    if(errors.password2) {
                        req.flash("password2", errors.password2);
                    }

                    if(files) {
                        fs.unlink(files.character[0].path, err => {});
                    }
                    
                    return res.redirect(originalRefer);
                }
                
                if(files && files.character && files.character.length > 0) {
                    const uploadedFile = files.character[0];
                    
                    const nowDate = new Date();
                    const newFileName = nowDate.getTime() + path.extname(uploadedFile.originalFilename);
                    const newFilePath = path.join(newUploadDir, newFileName.toString());

                    fs.rename(uploadedFile.path, newFilePath, function(err) {
                        if (err) {
                            return res.json(err);
                        }

                        bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(data.password, salt, (err, hash) => {
                            if(err) return res.json(err);

                            const newUser = new User({
                                name : fields.name[0],
                                email : fields.email[0],
                                character : newFileName,
                                password : hash
                            });

                            newUser.save ()
                                .then(user => res.json(user))
                                .catch(err => res.json(err));
                        });
                    });
                    });
                } 
                else {
                    let response = {
                        message : 'Select your File'
                    };
                    return res.json(response);
                }
                        
                    })
            .catch(err => {
                console.log('I am here too');
                return res.json(err);
            });

        

        const {errors, isValid} = validateRegister(data);

        if(!isValid) {
            if (errors.name) {
                req.flash("name", errors.name);
            }

            if(errors.email) {
                req.flash("email", errors.email);
            }

            if(errors.password) {
                req.flash("password", errors.password);
            }
            
            if(errors.password2) {
                req.flash("password2", errors.password2);
            }

            if(files) {
                fs.unlink(files.character[0].path, err => {});
            }

            return res.render('register');
        }
        
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

}