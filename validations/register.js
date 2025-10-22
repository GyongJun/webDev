const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateRegisterInput = data => {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (!Validator.isLength(data.name, {min:2, max:4})) {
        errors.name = "The Length of your name must 2-4 letters";
    }

    if(Validator.isEmpty(data.name)) {
        errors.name = "Enter you Name";
    }

    if(Validator.isEmpty(data.email)) {
        console.log(Validator.isEmpty(data.email));
        errors.name = "Enter your Email-Adress";
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = "The style of you Address is not correct";
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = "Enter your password";
    }

    if(Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm your password";
    }

    return {
        errors,
        isValid : isEmpty(errors)
    };
};