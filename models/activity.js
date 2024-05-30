const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActivitySchema = new Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    id_tambang: {
        type: Schema.Types.ObjectId,
        required: true,
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
        default: null
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false
    }
    }, {
        timestamps: true
    })

module.exports = mongoose.model('Activity', ActivitySchema)