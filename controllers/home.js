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
        if(files && files.character && files.character.length > 0) {
            const uploadedFile = files.character[0];
            
            const nowDate = new Date();
            const newFileName = nowDate.getTime() + path.extname(uploadedFile.originalFilename);
            const newFilePath = path.join(newUploadDir, newFileName.toString());

            fs.rename(uploadedFile.path, newFilePath, function(err) {
                if (err) {
                    return res.json(err);
                }
                else {
                    let response = {
                        message: 'Succefully Uploaded',
                        filename: newFileName
                    };
                    res.json(response);
                }
            });
        } 
        else {
            let response = {
                message : 'Select you File'
            };
            res.json(response);
        }
    });
}

