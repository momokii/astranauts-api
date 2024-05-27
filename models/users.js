const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name:  {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    }
},
    {
        timestamps: true
    })


module.exports = mongoose.model('User', userSchema)