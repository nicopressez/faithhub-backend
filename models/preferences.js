const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PreferencesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    prayerRequest: {
        type: Boolean,
        default: true
    },
    discussion: {
        type: Boolean,
        default: true
    },
    testimony: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model("Preferences", PreferencesSchema)