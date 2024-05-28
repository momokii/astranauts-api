const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActivitySchema = new Schema({
    nik_spv: {
        type: String,
        required: true
    },
    id_tambang: {
        type: Schema.Types.ObjectId,
        ref: 'Tambang'
    },
    layer: {
        type: Number,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    waktu_mulai: {
        type: Date,
        required: true
    },
    waktu_selesai: {
        type: Date,
        required: true
    }
    }, {
        timestamps: true
    })

module.exports = mongoose.model('Activity', ActivitySchema)