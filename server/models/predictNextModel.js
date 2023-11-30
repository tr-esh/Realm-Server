const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const predictNextSchema = new Schema({
  metricType: String,
  values: [
    {
      timestamp: Date,
      value: Number
    }
  ]
});

module.exports = mongoose.model('PredictNext', predictNextSchema);
