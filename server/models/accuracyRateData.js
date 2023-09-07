const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accuracyRateSchema = new Schema({
    timestamp: Date,
    temperature: Number,
    turbidity: Number,
    pH: Number
})

module.exports = mongoose.model('AccuracyRate', accuracyRateSchema);