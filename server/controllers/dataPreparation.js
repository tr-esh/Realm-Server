const mongoose = require('mongoose');
const tf = require('@tensorflow/tfjs-node');
const pHModel = require('../models/phLevelModel');
const temperatureModel = require('../models/temperatureModel');
const turbidityModel = require('../models/turbidityModel');
const PredictionsModel = require('../models/predictionModel');
const fs = require('fs'); // For file I/O operations
const path = require('path'); // For handling and transforming file paths
const cron = require('node-cron'); //for periodic running of processes

    // MongoDB connection string
    const dbURI = 'mongodb+srv://realmadmin:ZSt6kE8TzgVq92jt@realmcluster.ole0mns.mongodb.net/?retryWrites=true&w=majority';

    const connectDB = async () => {
      try {
        await mongoose.connect(dbURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
      } catch (err) {
        console.error(`Error: ${err.message}`);
        // Exit process with failure
        process.exit(1);
      }
    };

    // Create 'models' directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'models'))) {
      fs.mkdirSync(path.join(__dirname, 'models'));
    }

    // Ensure specific model directories also exist
    const ensureModelDirectoryExists = (modelPath) => {
      if (!fs.existsSync(modelPath)) {
          fs.mkdirSync(modelPath);
      }
    };

    const pHModelSavePath = path.join(__dirname, 'models', 'ph_model');
    const temperatureModelSavePath = path.join(__dirname, 'models', 'temperature_model');
    const turbidityModelSavePath = path.join(__dirname, 'models', 'turbidity_model');

    ensureModelDirectoryExists(pHModelSavePath);
    ensureModelDirectoryExists(temperatureModelSavePath);
    ensureModelDirectoryExists(turbidityModelSavePath);

    // Connect to MongoDB
    connectDB();
    const sequenceLength = 20;

    const preprocessData = (data) => {
      // Ensure all values are numbers
      data = data.map((val) => parseFloat(val));

      // Go through each value in the array
      data = data.filter(val => val >= 0); // Remove negative values

      return data;
    };


    const listFilesInDirectory = (directoryPath) => {
      const files = fs.readdirSync(directoryPath);
      console.log(`Files in ${directoryPath}:`, files);
    };


    const fetchDataAndTrain = async (mongooseModel, valueKey, modelSavePath) => {
      try {
        let tfModel;

        // Check if a trained model exists
        if (fs.existsSync(path.join(modelSavePath, 'model.json'))) {
          console.log(`Loading existing model from ${modelSavePath}...`);
          tfModel = await tf.loadLayersModel('file://' + path.join(modelSavePath, 'model.json'));

          tfModel.compile({ loss: 'meanSquaredError', optimizer: 'rmsprop' });
        } else {
          console.log('Defining a new model...');
          tfModel = tf.sequential();
          tfModel.add(tf.layers.lstm({ units: 128, returnSequences: true, inputShape: [sequenceLength, 1] }));
          tfModel.add(tf.layers.lstm({ units: 64, returnSequences: true }));
          tfModel.add(tf.layers.lstm({ units: 32, returnSequences: false }));
          tfModel.add(tf.layers.dense({ units: 12 }));

          tfModel.compile({ loss: 'meanSquaredError', optimizer: 'rmsprop' });
        }

        console.log('Fetching data...');
        const docs = await mongooseModel.find().sort({ createdAt: 1 });

        console.log('Data fetched, starting training...');
        let trainingData = docs.map(doc => parseFloat(doc[valueKey]));
        trainingData = trainingData.filter(val => !isNaN(val));
        trainingData = preprocessData(trainingData);

        let sequences = [];
        let labels = [];
        for (let i = 0; i < trainingData.length - sequenceLength - 12; i++) {
            let sequence = trainingData.slice(i, i + sequenceLength);
            let label = trainingData.slice(i + sequenceLength, i + sequenceLength + 12);
            if (sequence.length === sequenceLength && label.length === 12) {
                sequences.push(sequence.map(value => [value]));
                labels.push(label);
            }
        }

        const xs = tf.tensor3d(sequences, [sequences.length, sequenceLength, 1]);
        const ys = tf.tensor2d(labels, [labels.length, 12]);

        await tfModel.fit(xs, ys, {
          batchSize: 32,
          epochs: 10
        });

        console.log('Training complete, saving model...');
        ensureModelDirectoryExists(modelSavePath);
        await tfModel.save('file://' + modelSavePath);
        console.log(`Model saved to ${modelSavePath}`);

        listFilesInDirectory(modelSavePath);

        const newData = docs.slice(-sequenceLength).map(doc => doc[valueKey]);
        const inputData = tf.tensor3d([newData.map(value => [value])], [1, sequenceLength, 1]);
        const output = tfModel.predict(inputData);
        output.print();

        return true; 

      } catch (err) {
        console.error('Failed to fetch data or train the model.', err);
        return false;
      }
    };


    const savePredictionsToDB = async (metricType, predictions) => {
      const prediction = new PredictionsModel({
          metricType: metricType,
          values: predictions
      });
    
        await prediction.save();
    };
  

    const getCurrentAndFutureTimes = () => {
      const now = new Date();
      now.setHours(now.getHours(), (now.getMinutes() >= 30 ? 60 : 0), 0, 0);
      const times = [now];
  
      for (let i = 1; i <= 11; i++) {
          const futureTime = new Date(now);
          futureTime.setHours(now.getHours() + 2 * i);
          times.push(futureTime);
      }
  
      return times;
  }


    const predictValues = async (mongooseModel, valueKey, modelSavePath, metricType) => {
      try {
        // Diagnostic Log before loading the model
        listFilesInDirectory(modelSavePath);

        // Check if model exists before loading
        if (!fs.existsSync(path.join(modelSavePath, 'model.json'))) {
          console.error('Model not found at', modelSavePath);
          return [];
          }

          const tfModel = await tf.loadLayersModel('file://' + path.join(modelSavePath, 'model.json'));

          // Fetch the last `sequenceLength` data points from the database
          const docs = await mongooseModel.find().sort({createdAt: -1}).limit(sequenceLength);
          const newData = docs.map(doc => parseFloat(doc[valueKey]));
          
          // Check if you fetched enough data, if not you might want to handle it differently
          if (newData.length < sequenceLength) {
              console.error('Not enough data for making a prediction.');
              return [];
          }

          const inputData = tf.tensor3d([newData.map(value => [value])], [1, sequenceLength, 1]);

          const output = tfModel.predict(inputData);
          const predictionsArray = output.arraySync()[0];
          const futureTimes = getCurrentAndFutureTimes();

          // Create an array of objects with both value and timestamp
          const predictionsWithTimestamps = futureTimes.map((timestamp, index) => {
              return {
                  timestamp: timestamp,
                  value: predictionsArray[index]
              };
          });

          await savePredictionsToDB(metricType, predictionsWithTimestamps);
          return predictionsWithTimestamps;

      } catch (err) {
          console.error('Failed to fetch data or make prediction.', err);
          return [];
      }
      };

    const fetchDataAndTrainAllMetrics = async () => {
      try {
        await fetchDataAndTrain(pHModel, 'ph_value', pHModelSavePath);
        await fetchDataAndTrain(temperatureModel, 'temperature_value', temperatureModelSavePath);
        await fetchDataAndTrain(turbidityModel, 'ntu_value', turbidityModelSavePath);
      } catch (err) {
        console.error('Error while fetching data and training:', err);
      }
    };

    const predictValuesForAllMetrics = async () => {
      try {
        await predictValues(pHModel, 'ph_value', pHModelSavePath, 'ph');
        await predictValues(temperatureModel, 'temperature_value', temperatureModelSavePath, 'temperature');
        await predictValues(turbidityModel, 'ntu_value', turbidityModelSavePath, 'turbidity');
      } catch (err) {
        console.error('Error while predicting values:', err);
      }
    };


    const scheduleDataJobs = () => {
      // Schedule fetchDataAndTrain for all metrics to run daily at 3:00 AM
      cron.schedule('0 3 * * *', fetchDataAndTrainAllMetrics);
      // Schedule predictValues for all metrics to run every 5 minutes
      cron.schedule('*/30 * * * *', () => {
        console.log('Cron job triggered!');
        predictValuesForAllMetrics();
      });
    };


    // const main = async () => {
    //   try {
    //     await fetchDataAndTrain(pHModel, 'ph_value', pHModelSavePath);
    //     await new Promise(resolve => setTimeout(resolve, 5000));
    //     await predictValues(pHModel, 'ph_value', pHModelSavePath, 'ph');

    //     await fetchDataAndTrain(temperatureModel, 'temperature_value', temperatureModelSavePath);
    //     await new Promise(resolve => setTimeout(resolve, 5000));
    //     await predictValues(temperatureModel, 'temperature_value', temperatureModelSavePath, 'temperature');

    //     await fetchDataAndTrain(turbidityModel, 'ntu_value', turbidityModelSavePath);
    //     await new Promise(resolve => setTimeout(resolve, 5000));
    //     await predictValues(turbidityModel, 'ntu_value', turbidityModelSavePath, 'turbidity');

    //     console.log('All tasks are done.');
    //   } catch (err) {
    //     console.error('Error while processing data:', err);
    //   } finally {
    //     // mongoose.disconnect();
    //     // console.log('Disconnected from MongoDB');
    //     // process.exit(0);
    //   }
    // }
    //   if (require.main === module) {
    //     main();
    // }



module.exports = { predictValues, scheduleDataJobs }

