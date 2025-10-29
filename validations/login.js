const { error } = require('console');
const isEmpty = require('./is-empty');
const validate = require('validator');

module.exports = validateLogin = data => {
    let errors = {};
    
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(validate.isEmpty(data.email)) {
        errors.email = "Enter your email adress";
    }

    if(!validate.isEmail(data.email)) {
        errors.email = "Your Email Style is not correct";
    }

    if(validate.isEmpty(data.password)) {
        errors.password = "Enter your password";
    }
    return {
        errors,
        isValid : isEmpty(errors)
    };
}