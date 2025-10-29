const express = require('express');
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const uploadDir = require('../config/key').uploadDir;
const userModel = require('../models/User');
const User = require('../models/User');
const validateRegister = require('../validations/register');

exports.index = (req, res) => {
    res.render('index');
}

exports.registerView = (req, res) => {
    res.render('registerView');
}

exports.loginView = (req, res) => {
    res.render('login');
}

exports.forum = (req, res) => {
    res.render('forum');
}

exports.logout = (req, res) => {
    req.session.user = null;
    res.redirect('/');
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = await User.findOne({email: email});
    if(!existingUser) {
        return res.json({email: 'The User is not existed'});
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if(isMatch) {
       req.session.user = existingUser;
       res.redirect('/'); 
    }
    else {
        return res.json({password: 'The User Password is not correct'});
    }
}

exports.register = (req, res) => {
    const newUploadDir = path.join(__dirname, uploadDir);
    const originalRefer = req.get('Referer');

    const form = new multiparty.Form({uploadDir: newUploadDir});

    form.parse(req, async (err, fields, files) => {
        if(err)
            return res.json(err);

        const data = {
            name: fields.name[0],
            email: fields.email[0],
            password: fields.password[0],
            password2: fields.password2[0]
        };

        try {
            const existingUser = await User.findOne({email: data.email});
            if(existingUser) {
                req.flash('email', 'The email is already associated with others');
                return res.redirect(originalRefer);
            }

            const {errors, isValid} = validateRegister(data);
            if(!isValid) {
                if(errors.name) req.flash('name', errors.name);
                if(errors.email) req.flash('email', errors.email);
                if(errors.password) req.flash('password', errors.password);
                if(errors.password2) req.flash('password2', errors.password2);

                if(files && files.character && files.character[0].length > 0) {
                    fs.unlink(files.character[0].path, err => {});
                }

                return res.redirect(originalRefer);
            }

            if(!files || !files.character || files.character[0].length === 0) {
                req.flash ('error', 'Select your file');
                return res.redirect(originalRefer);
            }

            const uploadFile = files.character[0];
            const nowDate = new Date();
            const newFileName = nowDate.getTime() + path.extname(uploadFile.originalFilename);
            const newFilePath = path.join(newUploadDir, newFileName.toString());

            await fs.promises.rename(uploadFile.path, newFilePath);

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(data.password, salt);

            const newUser = new User({
                name: data.name,
                email: data.email,
                password: hash,
                character: newFileName
            });

            await newUser.save();

            res.redirect('/login');
        }
        catch(err) {
            console.error('Registration error:', err);

            if(files && files.character && files.character[0].length > 0) {
                fs.unlink(files.character[0].path, err => {});
            }

            req.flash('error', 'Registration failed');
            res.redirect(originalRefer);
        }
    });
}
