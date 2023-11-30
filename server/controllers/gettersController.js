const TemperatureReading = require('../models/temperatureModel')
const TurbidityReading = require('../models/turbidityModel')
const phLevelReading = require('../models/phLevelModel')


const fetchTemp = async (req, res) => {
    const temp = await TemperatureReading.findOne({}, 
      {_id: 1, parameter_name: 1, temperature_value: 1, status: 1})
      .sort({createdAt: -1})

    res.status(200).json(temp)
}

const fetchTurbidity = async (req, res) => {
    const turbid = await  TurbidityReading.findOne({}, 
      {_id: 1, parameter_name: 1, ntu_value: 1, status: 1})
      .sort({createdAt: -1})

    res.status(200).json(turbid)
}

const fetchph = async (req, res) => {
    const phlevel = await phLevelReading.findOne({}, 
      {_id: 1,  parameter_name: 1, ph_value: 1, status: 1})
      .sort({createdAt: -1})
      
    res.status(200).json(phlevel)
}


const fetchParameters = async (req, res) => {
    try {
        const [temp, turbid, phlevel] = await Promise.all([
          TemperatureReading.find({}),
          TurbidityReading.find({}),
          phLevelReading.find({})
        ]);
    
        const parameters = [...temp, ...turbid, ...phlevel];
    
        const data = parameters
          .filter((parameter) => 
            parameter.temperature_value || 
            parameter.ntu_value || 
            parameter.ph_value)

          .map(({ _id, sensor_type, 
            parameter_name, 
            temperature_value, 
            ntu_value, 
            ph_value, 
            status, 
            createdAt }) => ({
              id: _id,
              sensor: sensor_type,
              type: parameter_name,
              value: [temperature_value, ntu_value, ph_value].filter(Boolean),
              status,
              createdAt,
            })
          );
    
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ message: 'Cannot get all the request' });
      }
}


const getHourlyMean = async (collectionName) => {
    let collection;
      switch (collectionName) {
        case 'TemperatureReading':
          collection = TemperatureReading;
          break;
        case 'TurbidityReading':
          collection = TurbidityReading;
          break;
        case 'phLevelReading':
          collection = phLevelReading;
          break;
        default:
          return null;
      }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const results = await collection.aggregate([
        {
          $match: {
            createdAt: { $gte: oneHourAgo, $lte: now }
          }
        },
        {
          $group: {
            _id: null,
            meanValue: { $avg: `$${collectionName == 'phLevelReading' ? 
              'ph_value' : `${collectionName.toLowerCase()}_value`}` }
          }
        }
    ]).exec();

    return results[0]?.meanValue ?? null;
};

    
const fetchHourlyMeans = async (req, res) => {
    const temperatureMean = await getHourlyMean('TemperatureReading');
    const turbidityMean = await getHourlyMean('TurbidityReading');
    const phMean = await getHourlyMean('phLevelReading');

    res.status(200).json({ temperatureMean, turbidityMean, phMean });
};
    
const fetchAbnormalParameters = async (req, res) => {
    try {
        const [temp, turbid, phlevel] = await Promise.all([
          TemperatureReading.find({}),
          TurbidityReading.find({}),
          phLevelReading.find({})
        ]);
    
        const parameters = [...temp, ...turbid, ...phlevel];
    
        const data = parameters
          .filter(parameter => parameter.temperature_value !== undefined ||
             parameter.ntu_value !== undefined ||
              parameter.ph_value !== undefined
            )

          .map(({ _id, sensor_type, 
              parameter_name, 
              temperature_value, 
              ntu_value, 
              ph_value, 
              status, 
              createdAt }) => {

              const valueArray = [temperature_value, ntu_value, ph_value]
              .filter(value => value >= 0);

              return {
                id: _id,
                sensor: sensor_type,
                type: parameter_name,
                value: valueArray,
                status,
                createdAt,
              };
            });
    
        // Calculate the count of abnormal data points for each parameter
        const abnormalCounts = {
          temperature: data.filter(({ type, value }) => 
            type === 'temperature' && (value < 15 || value > 30)).length,

          turbidity: data.filter(({ type, value }) => 
            type === 'turbidity' && (value < 1000 || value > 5000)).length,

          ph: data.filter(({ type, value }) => 
            type === 'ph' && (value < 7.5 || value > 8.5)).length,
        };
    
        // Determine which parameter has the most abnormal data points
        let mostAbnormalParameter = '';
        let maxAbnormalCount = 0;
        for (const parameter in abnormalCounts) {
          if (abnormalCounts[parameter] > maxAbnormalCount) {
            mostAbnormalParameter = parameter;
            maxAbnormalCount = abnormalCounts[parameter];
          }
        }
    
        res.status(200).json({
          data: data,
          mostAbnormalParameter: mostAbnormalParameter,
          maxAbnormalCount: maxAbnormalCount,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ message: 'Cannot get all the request' });
    }
};  


module.exports = { fetchTemp, fetchTurbidity, fetchph, fetchParameters, fetchHourlyMeans, fetchAbnormalParameters}
