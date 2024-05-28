const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TambangSchema = new Schema({
    nama_tambang: {
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

module.exports = mongoose.model('Tambang', TambangSchema)