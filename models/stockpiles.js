const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StockpileSchema = new Schema({
    nama_stockpile: {
        type: String,
        required: true
    },
    lokasi: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    jumlah_layer: {
        type: Number,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    total_capacity: {
        type: Number,
        required: true,
        default: 0
    }, 
    max_capacity: {
        type: Number,
        required: true
    },
    coal_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Coal'
    }]
    },
    {
        timestamps: true
    })


module.exports = mongoose.model('Stockpile', StockpileSchema)