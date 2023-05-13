const TemperatureReading = require('../models/temperatureModel')
const TurbidityReading = require('../models/turbidityModel')
const phLevelReading = require('../models/phLevelModel')


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
                const turbidity = latestTurbidities.find(turbidity => turbidity._id === turbidity._id);
                const phLevel = latestPhLevels.find(phLevel => phLevel._id === phLevel._id);
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
      const latestTemperature = await TemperatureReading.findOne().sort({ createdAt: -1 }).select('temperature_value status');
      
      // Fetch the latest turbidity reading and status
      const latestTurbidity = await TurbidityReading.findOne().sort({ createdAt: -1 }).select('ntu_value status');
      
      // Fetch the latest pH level reading and status
      const latestPhLevel = await phLevelReading.findOne().sort({ createdAt: -1 }).select('ph_value status');
  
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


  // const barParameters = async (req, res) => {
  //   const parameters = {};

  //   try {
  //     const temperatures = await TemperatureReading.find();
  //     const highTemperatures = await TemperatureReading.find([
  //       {
  //         $match: {
  //           temperature_value: { $gt: 25, $lt: 0 }
  //         }
  //       }
  //     ]);
  
  //     const pHs = await phLevelReading.find();
  //     const highpHs = await phLevelReading.aggregate([
  //       {
  //         $match: {
  //           ph_value: { $lt: 7, $gt: 8.5 }
  //         }
  //       }
  //     ]);
  
  //     const turbidities = await TurbidityReading.find();
  //     const highTurbidities = await TurbidityReading.aggregate([
  //       {
  //         $match: {
  //           ntu_value: { $gt: 5 }
  //         }
  //       }
  //     ]);
  
  //     const parameters = {
  //       temperature: {
  //         data: temperatures,
  //         highValues: highTemperatures
  //       },
  //       pH: {
  //         data: pHs,
  //         highValues: highpHs
  //       },
  //       turbidity: {
  //         data: turbidities,
  //         highValues: highTurbidities
  //       }
  //     };
  
  //     res.status(200).json(parameters);
  
  //   } catch (error) {
  //     return res.status(500).json({
  //       message: 'Fetching parameters failed!',
  //       error: error
  //     });
  //   }  
  // };
  
  

  
  
  module.exports = { allParameters, getAllParameters}