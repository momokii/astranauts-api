const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CoalSchema = new Schema({
    activity_id: {
        type: Schema.Types.ObjectId,
        ref: 'Activity'
    },
    cal_value: {
        type: String,
        required: true
    },
    ash_cont: {
        type: String,
        required: true
    },
    moist_cont: {
        type: String,
        required: true
    },
    sulph_cont: {
        type: String,
        required: true
    },
    fc_vm : {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Coal', CoalSchema)