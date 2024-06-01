const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChurchSchema = new Schema({
  name: {
   type: String,
   required: true,
   minLength: 5,
   maxLength: 60,
  },
  location: {
   type: String,
  },
  description: {
   type: String,
   minLength: 10,
   maxLength: 150,
  },
  profile_picture: {
   type: String
  },
  connect: 
   [{
    type: Schema.Types.ObjectId,
    ref: "connect"
   }],
  admins: [{
   type: Schema.Types.ObjectId,
   ref: "user"
  }],
  likes: [{
   type: Schema.Types.ObjectId,
   ref: "user"
  }],
  service: [
   {
    type: String,
   }
  ]
})

module.exports = mongoose.Model("Church", ChurchSchema)