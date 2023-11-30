const TemperatureReading = require('../models/temperatureModel')
const TurbidityReading = require('../models/turbidityModel')
const phLevelReading = require('../models/phLevelModel')
const moment = require('moment');


moment.updateLocale('en', {
  week: {
    dow: 0, // Sunday is the first day of the week
    doy: 4  // First week of the year must contain 4 January (7 + 1 - 4)
  }
});

const highParameters = async (req, res) => {
  try {
    const currentDate = moment();
    const firstDayOfWeek = currentDate.clone().startOf('week');
    let weeklyData = [];

    // Fetch current week's data
    for (let i = 0; i < 7; i++) {
      const day = firstDayOfWeek.clone().add(i, 'days');
      const formattedDay = day.format('ddd');

      const tempCount = await TemperatureReading.countDocuments({
        status: /^Warning: Rising Temperature/,
        createdAt: { $gte: day.toDate(), 
                      $lt: day.clone().add(1, 'days').toDate() },
      });

      const turbidCount = await TurbidityReading.countDocuments({
        status: /^Warning: High Turbid/,
        createdAt: { $gte: day.toDate(), 
                     $lt: day.clone().add(1, 'days').toDate() },
      });

      const phCount = await phLevelReading.countDocuments({
        status: /^Caution: Acidic/,
        createdAt: { $gte: day.toDate(), 
                     $lt: day.clone().add(1, 'days').toDate() },
      });

      weeklyData.push({
        day: formattedDay,
        temperature: tempCount,
        turbidity: turbidCount,
        pH: phCount,
      });
    }

    // Check if the current week's data is "empty"
    const isEmpty = weeklyData.every(entry => 
       entry.temperature === 0 && entry.turbidity === 0 && entry.pH === 0
    );

    if (isEmpty) {
      // Fetch last week's data if the current week's data is empty
      const lastWeekStart = firstDayOfWeek.clone().subtract(7, 'days');
      weeklyData = []; // Reset weeklyData array

      for (let i = 0; i < 7; i++) {
        const day = lastWeekStart.clone().add(i, 'days');
        const formattedDay = day.format('ddd');

        const tempCount = await TemperatureReading.countDocuments({
          status: /^Warning: Rising Temperature/,
          createdAt: { $gte: day.toDate(),
                       $lt: day.clone().add(1, 'days').toDate() },
        });

        const turbidCount = await TurbidityReading.countDocuments({
          status: /^Warning: High Turbid/,
          createdAt: { $gte: day.toDate(),
                       $lt: day.clone().add(1, 'days').toDate() },
        });

        const phCount = await phLevelReading.countDocuments({
          status: /^Caution: Acidic/,
          createdAt: { $gte: day.toDate(),
                       $lt: day.clone().add(1, 'days').toDate() },
        });

        weeklyData.push({
          day: formattedDay,
          temperature: tempCount,
          turbidity: turbidCount,
          pH: phCount,
        });
      }
    }

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ message: 'Cannot get all the request' });
  }
};

module.exports = { highParameters };
