const mongoose = require('mongoose')

const Schema = mongoose.Schema

const predictionSchema = new Schema({
    metricType: String,
    values: [{
        timestamp: Date,
        value: Number
    }]
});

module.exports = mongoose.model('Predictions', predictionSchema);