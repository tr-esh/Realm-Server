const mongoose = require('mongoose')


const Schema = mongoose.Schema

const phReadingSchema = new Schema({
    IoT_module: {
        type: String,
        required: true
    },
    sensor_code: {
        type: String,
        required: true
    },
    sensor_type: {
        type: String,
        required: true
    },
    parameter_name: {
        type: String,
        required: true
    },
    ph_value: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
    },{ timestamps: true })

module.exports = mongoose.model('pH_Level', phReadingSchema)