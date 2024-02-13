const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type:String, minLength: 4, maxLength: 16},
    first_name: {type: String, minLength: 2, maxLength: 12, required:true},
    last_name: {type: String, minLength: 2, maxLength: 12, required:true},
    password: {type: String, required:true},
    profile_picture: {type: String},
    cover_picture: {type: String},
    location: {type: String},
    friends: [{type: Schema.Types.ObjectId, ref:"User"}],
    posts: [{type: Schema.Types.ObjectId, ref:"Post"}],
    bio: {type: String},
    church: {type: Schema.Types.ObjectId, ref:"Church"},
    connect: [{type: Schema.Types.ObjectId, ref:"Connect"}],
    likes: [{type:Schema.Types.ObjectId, ref:"Post"}],
    preferences: {type: Schema.Types.ObjectId, ref:"Preferences"}
})

UserSchema.virtual('full_name').get(function () {
    return `${this.first_name} ${this.last_name}`
})

module.exports = mongoose.model("User", UserSchema);