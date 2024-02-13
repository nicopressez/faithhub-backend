const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    content: {
        type: String, 
        required:true, 
        minLength: 10, maxLength: 2000
    },
    type: {
        type: String,
         enum: ['Prayer Request', 'Discussion', 'Testimony'],
         required:true
        },
    anonymous: {
        type: Boolean,
        default: false
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref:"User"
    },
    date: {
        type: Date,
        default: Date.now,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    edited: {type: Boolean, default:false}
})

module.exports = mongoose.model("Post", PostSchema)