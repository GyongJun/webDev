const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        match : [/.+\@.+\..+/, 'Use the true type of Email'],
        required: true
    },
    character : {
        type : String
    },
    password : {
        type : String,
        require : true
    },
    date : {
        type : Date,
        default : Date.now
    }
});

module.exports = User = mongoose.model('users', UserSchema);