const mongoose = require('mongoose')

const Schema = mongoose.Schema

const predictionSchema = new Schema({
    metricType: String,
    timestamp: Date,
    values: [Number]
});

module.exports = mongoose.model('Predictions', predictionSchema);