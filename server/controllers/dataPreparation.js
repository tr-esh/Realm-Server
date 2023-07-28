const mongoose = require('mongoose');
const brain = require('brain.js');
const pHModel = require('../models/phLevelModel');
const tempModel = require('../models/temperatureModel');
const turbidModel = require('../models/turbidityModel');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://realmadmin:ZSt6kE8TzgVq92jt@realmcluster.ole0mns.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB is connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

const fetchDataAndTrain = async (model, valueKey) => {
  try {
    const net = new brain.recurrent.LSTMTimeStep(); // New instance for each type of data

    // Fetch the data from the database
    const docs = await model.find().sort({createdAt: 1});
    const trainingData = docs.map(doc => doc[valueKey]);

    // Train the network
    net.train([trainingData]);

    // Use real-time data for prediction
    const newData = docs.slice(-5).map(doc => doc[valueKey]); // Use last 5 values

    // Predict the next value after the sequence
    const output = net.run(newData);

    console.log(output);

  } catch(err) {
    console.error('Failed to fetch data or train the model.', err);
  }
};

// Connect to the DB once
connectDB().then(() => {
  // Fetch and train data
  fetchDataAndTrain(pHModel, 'ph_value');
  fetchDataAndTrain(tempModel, 'temperature_value');
  fetchDataAndTrain(turbidModel, 'ntu_value');
}).catch(err => console.error('Failed to connect to MongoDB', err));
