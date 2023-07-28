const TemperatureReading = require('../models/temperatureModel');
const TurbidityReading = require('../models/turbidityModel');
const phLevelReading = require('../models/phLevelModel');




const calculateAverage = async (req, res) => {
    try {
      const [temp, turbid, phlevel] = await Promise.all([
        TemperatureReading.find({}),
        TurbidityReading.find({}),
        phLevelReading.find({})
      ]);
  
      const parameters = [...temp, ...turbid, ...phlevel];
  
      const data = parameters
        .filter((parameter) => parameter.temperature_value || parameter.ntu_value || parameter.ph_value)
        .map(({ _id, sensor_type, parameter_name, temperature_value, ntu_value, ph_value, status, createdAt }) => ({
          id: _id,
          sensor: sensor_type,
          type: parameter_name,
          value: [temperature_value, ntu_value, ph_value].filter(Boolean),
          status,
          createdAt,
        }));
  
      // Group data by parameter type (temperature, turbidity, ph) for calculating averages
      const parameterGroups = data.reduce((accumulator, currentValue) => {
        const { type, value, createdAt } = currentValue;
        const timestamp = new Date(createdAt);
        const hourKey = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}-${timestamp.getHours()}`;
  
        if (!accumulator[type]) {
          accumulator[type] = {
            count: 0,
            totalValue: 0,
            average: 0,
          };
        }
  
        // Filter out negative values before summing
        const nonNegativeValues = value.filter((val) => val >= 0);
  
        accumulator[type].count += nonNegativeValues.length;
        accumulator[type].totalValue += nonNegativeValues.reduce((sum, val) => sum + val, 0);
        accumulator[type].average = accumulator[type].totalValue / accumulator[type].count;
  
        return accumulator;
      }, {});
  
    // Calculate total average from all the parameter averages
    const totalAverage = Object.values(parameterGroups).reduce((sum, parameter) => sum + parameter.average, 0);
    const totalCount = Object.values(parameterGroups).reduce((sum, parameter) => sum + parameter.count, 0);
    const overallAverage = totalAverage / totalCount;

    res.status(200).json({ overallAverage: overallAverage * 100 }); // Present the overall average as a percentage
  } catch (error) {
    res.status(500).json({ message: 'Cannot get all the request' });
  }
}
  
  
  

module.exports = { calculateAverage };
