const mongoose = require('mongoose');
const Temperature = require('../models/temperatureModel')
const pH_Level = require('../models/phLevelModel')
const Turbidity  = require('../models/temperatureModel')


const parameterReadingsSchema = new mongoose.Schema({
 
  temperature_value: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Temperature
  },
 
  turbidity_value: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Turbidity
  },
  ph_value: {
    type: mongoose.Schema.Types.ObjectId,
    ref: pH_Level
  },
  status: {
    type: String,
    ref: [Temperature, Turbidity, pH_Level]
}
});

module.exports = mongoose.model('ParamReadings', parameterReadingsSchema);