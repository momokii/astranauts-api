const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PelabuhanSchema = new Schema({
    nama_pelabuhan: {
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
    }
    }, {
        timestamps: true
    })

module.exports = mongoose.model('Pelabuhan', PelabuhanSchema)