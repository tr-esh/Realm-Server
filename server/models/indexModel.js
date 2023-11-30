const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const indexSchema = new Schema({
  index: String,
  interpretation: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Index', indexSchema);
