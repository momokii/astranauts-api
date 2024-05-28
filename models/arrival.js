const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArrivalSchema = new Schema({
    id_stockpile: {
        type: String,
        required: true
    },
    delivery_id: {
        type: String,
        required: true
    },
    truck_id: {
        type: String,
        required: true, 
    },
    nik_pic: {
        type: String,
        required: true
    },
    nik_driver: {
        type: String,
        required: true
    },
    coal_id: {
        type: String,
        required: true
    },
    lokasi_asal: {
        kategori: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    load_quantity: {
        type: Number,   
        required: true
    },
    load_volume: {
        type: Number,   
        required: true
    },
    waktu_tiba: {
        type: Date
    },
    is_confirmed: {
        type: Boolean,
        required: true,
        default: false
    },
    confirmed_by: {
        type: String
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Arrival', ArrivalSchema)