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
        enum: ['user-tambang', 'user-stockpile', 'admin'],
        default: 'user-tambang'
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    }
},
    {
        timestamps: true
    })


module.exports = mongoose.model('User', userSchema)