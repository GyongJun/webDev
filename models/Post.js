const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema;

const PostSchema = new Schema ({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    text : {
        type: String,
        required : true
    },

    date : {
        type : Date,
        defalue : Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);