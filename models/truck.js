const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TruckSchema = new Schema({
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    weight_capacity: {
        type: Number,
        required: true
    },
    volume_capacity: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Truck', TruckSchema)