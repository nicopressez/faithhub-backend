const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    first_name: {type: String, minLength: 2, maxLength: 12, required:true},
    last_name: {type: String, minLength: 2, maxLength: 12, required:true},
    password: {type: String, required:true},
    profile_picture: {type: String},
    cover_picture: {type: String},
    location: {type: String},
    friends: [{type: Schema.Types.ObjectId, ref:"user"}],
    posts: [{type: Schema.Types.ObjectId, ref:"post"}],
    bio: {type: String},
    church: {type: Schema.Types.ObjectId, ref:"church"},
    connect: [{type: Schema.Types.ObjectId, ref:"connect"}],
    likes: [{type:Schema.Types.ObjectId, ref:"post"}],
})

UserSchema.virtual('full_name').get(function () {
    return `${this.first_name} ${this.last_name}`
})

module.exports = mongoose.model("User", UserSchema);