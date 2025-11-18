const mongoose = require('mongoose');
const { type } = require('os');
const { ref } = require('process');
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
    },

    comments : [ 
        {
            user : {
                type : Schema.Types.ObjectId,
                ref : 'users'
            },
            
            text : {
                type : String,
                required : true
            },

            date : {
                type : Date,
                default : Date.now
            }
        }   
    ],

    likes : [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],

    likesCount : {
        type: Number,
        default: 0
    },

    dislikes : [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],

    dislikesCount : {
        type: Number,
        default: 0
    }

});

module.exports = Post = mongoose.model('post', PostSchema);