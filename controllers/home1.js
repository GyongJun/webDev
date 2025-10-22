const express = require('express');
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');
const uploadDir = require('../config/key').uploadDir;
const userModel = require('../models/User');
const User = require('../models/User');
const validateRegister = require('../validations/register');
const bcrypt = require('bcryptjs')

exports.index = (req, res) => {
    res.render('index');
}

exports.registerView = (req, res) => {
    res.render('registerView');
}

exports.login = (req, res) => {
    res.render('login');
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
                console.log(data.email);
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
            const newFileName = nowDate.getTime();
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

            req.flash('success', 'Registration  successful');
            res.redirect('login');
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
