const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    author: {
        type:Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1000
    }
})

module.exports = mongoose.model("Comment", CommentSchema)