const TemperatureReading = require('../models/temperatureModel')
const TurbidityReading = require('../models/turbidityModel')
const phLevelReading = require('../models/phLevelModel')
const DataModel = require('../models/accuracyRateData')
const AccuracyRate = require('../models/accuracyRateData')
const IndexModel = require('../models/indexModel')

const allParameters = async (req, res) => {
    try {
      const latestTemperatures = await TemperatureReading.aggregate([
        // Group the readings by parameter_name and return the latest reading for each group
        { $sort: { createdAt: -1 } },
        { $group: {
            _id: "$parameter_name",
            temperature_value: { $first: "$temperature_value" },
            status: { $first: "$status" }
        }}
      ]);
  
      const latestTurbidities = await TurbidityReading.aggregate([
        // Group the readings by parameter_name and return the latest reading for each group
        { $sort: { createdAt: -1 } },
        { $group: {
            _id: "$parameter_name",
            ntu_value: { $first: "$ntu_value" },
            status: { $first: "$status" }
        }}
      ]);
  
      const latestPhLevels = await phLevelReading.aggregate([
        // Group the readings by parameter_name and return the latest reading for each group
        { $sort: { createdAt: -1 } },
        { $group: {
            _id: "$parameter_name",
            ph_value: { $first: "$ph_value" },
            status: { $first: "$status" }
        }}
      ]);
  
      // Combine the latest readings from each model into a single array
      const latestReadings = latestTemperatures.map(temperature => {
                const turbidity = latestTurbidities.find(turbidity => 
                    turbidity._id === turbidity._id
                  );

                const phLevel = latestPhLevels.find(phLevel => 
                    phLevel._id === phLevel._id
                  );
        return {
          _id: temperature._id,
          parameter_name: [temperature._id, turbidity._id, phLevel._id],
          temperature_value: temperature.temperature_value,
          ntu_value: turbidity ? turbidity.ntu_value : null,
          ph_value: phLevel ? phLevel.ph_value : null,
          status: [temperature.status,turbidity.status,phLevel.status] 
        };

      });
      
      res.status(200).json(latestReadings);
    } catch (error) {
      res.status(500).json({ message: 'Cannot get all the request' });
    }
}


const getAllParameters = async (req, res) => {
    try {
      // Fetch the latest temperature reading and status
      const latestTemperature = await TemperatureReading.findOne()
                                    .sort({ createdAt: -1 })
                                    .select('temperature_value status');
      
      // Fetch the latest turbidity reading and status
      const latestTurbidity = await TurbidityReading.findOne()
                                  .sort({ createdAt: -1 })
                                  .select('ntu_value status');
      
      // Fetch the latest pH level reading and status
      const latestPhLevel = await phLevelReading.findOne()
                                .sort({ createdAt: -1 })
                                .select('ph_value status');
  
      // Combine the latest readings from each model into a single array
      const latestReadings = [
        {
          parameter_name: "temperature",
          temperature_value: latestTemperature.temperature_value,
          status: latestTemperature.status
        },
        {
          parameter_name: "turbidity",
          ntu_value: latestTurbidity.ntu_value,
          status: latestTurbidity.status
        },
        {
          parameter_name: "ph_level",
          ph_value: latestPhLevel.ph_value,
          status: latestPhLevel.status
        }
      ];
  
      // Return the latest readings and status for each parameter as a JSON response
      res.status(200).json(latestReadings);
    } catch (error) {
      res.status(500).json({ message: 'Cannot get all the request' });
    }
}


const saveAccuracyRate = async (req, res) => {
    try {
      // Check if data for this date already exists
      const existingData = await DataModel.findOne({ timestamp: req.body.timestamp });

      // If data exists, don't save again
      if (existingData) {
          return res.status(409).send({ message: 'Data for this date already exists' });
      }

      // Otherwise, save the new data
      const accuracyData = new DataModel({
          timestamp: req.body.timestamp,
          temperature: req.body.temperature,
          turbidity: req.body.turbidity,
          pH: req.body.pH
      });
      await accuracyData.save();
      res.status(200).send({ message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error saving data', error });
    }
}


const fetchAccuracyData = async (req, res) => {
    try {
      // Use the find method to retrieve data from the AccuracyRate model
      const data = await AccuracyRate.find({}).sort({timestamp: -1})
  
      // Check if data was found
      if (data.length === 0) {
        return res.status(404).send({ message: 'No data found' });
      }
  
      // If data is found, send it as a response
      res.status(200).send(data);
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      res.status(500).send({ message: 'Error fetching data', error });
    }
};

const saveIndex = async (req, res) => {
    try {
      const { index, interpretation } = req.body;
      const newIndex = new IndexModel({ index, interpretation, timestamp: new Date() });
      await newIndex.save();
      res.status(200).send({ message: 'Data saved successfully!' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to save data.' });
    }
};
  
  
module.exports = { allParameters, getAllParameters, saveAccuracyRate, saveIndex, fetchAccuracyData }
