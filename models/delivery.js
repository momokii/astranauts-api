const mongoose  = require('mongoose')
const Schema = mongoose.Schema 

const DeliverySchema = new Schema({
    id_stockpile: {
        type: String,
        required: true
    },
    delivery_id: {
        type: String,
        required: true
    },
    truck_id: {
        type: Schema.Types.ObjectId,
        required: true, 
        ref: 'Truck'
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
            required: true,
            enum: ['tambang', 'stockpile', 'pelabuhan']
        },
        id: {
            type: String,
            required: true
        }
    },
    lokasi_tujuan: {
        kategori: {
            type: String,
            required: true,
            enum: ['tambang', 'stockpile', 'pelabuhan']
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
    waktu_mulai: {
        type: Date,
        required: true
    },
    waktu_selesai: {
        type: Date
    },
    log: [{
        timestamp: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['loading', 'unloading', 'on the way']
        },
        message: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Delivery', DeliverySchema)