const TemperatureReading = require('../models/temperatureModel')
const TurbidityReading = require('../models/turbidityModel')
const phLevelReading = require('../models/phLevelModel')
const moment = require('moment');

const highParameters = async (req, res) => {
  try {
    // Get the current date to determine the start of the week
    const currentDate = moment();
    const firstDayOfWeek = currentDate.clone().startOf('isoWeek');

    // Initialize an array to hold the weekly data
    const weeklyData = [];

    // Loop through each day of the week and calculate the counts for each parameter
    for (let i = 0; i < 7; i++) {
      const day = firstDayOfWeek.clone().add(i, 'days');
      const formattedDay = day.format('ddd'); // Get the shortened day label (e.g., Mon, Tue, etc.)

      const tempCount = await TemperatureReading.countDocuments({
        status: /^Warning: Rising Temperature/,
        createdAt: { $gte: day.toDate(), $lt: day.clone().add(1, 'days').toDate() },
      });

      const turbidCount = await TurbidityReading.countDocuments({
        status: /^Warning: High Turbid/,
        createdAt: { $gte: day.toDate(), $lt: day.clone().add(1, 'days').toDate() },
      });

      const phCount = await phLevelReading.countDocuments({
        status: /^Caution: Acidic/,
        createdAt: { $gte: day.toDate(), $lt: day.clone().add(1, 'days').toDate() },
      });

      weeklyData.push({
        day: formattedDay,
        temperature: tempCount,
        turbidity: turbidCount,
        pH: phCount,
      });
    }

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ message: 'Cannot get all the request' });
  }
};



module.exports = { highParameters }