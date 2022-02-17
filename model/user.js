const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required: 'true',
        unique: true
    },

    password : {
        type: String,
        required: 'true'
    }
},{ collection: 'users'})

const model = new mongoose.model('User', UserSchema)

module.exports = model