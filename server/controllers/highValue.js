const TemperatureReading = require('../models/temperatureModel')
const TurbidityReading = require('../models/turbidityModel')
const phLevelReading = require('../models/phLevelModel')

const highParameters = async (req, res) => {
    try {
        const now = new Date();
        const hours = [now.getHours(), now.getHours() - 1, now.getHours() - 2];

        const tempHigh = await TemperatureReading.aggregate([
            {
                $match: {
                    temperature_value: { $gt: 22 },
                    createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours[0], 0, 0) }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);

        const turbidHigh = await TurbidityReading.aggregate([
            {
                $match: {
                    ntu_value: { $gt: 100 },
                    createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours[0], 0, 0) }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);

        const phlevelHigh = await phLevelReading.aggregate([
            {
                $match: {
                    ph_value: { $lt: 6.8 },
                    createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours[0], 0, 0) }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Combine the high value arrays into a single object
        const highValues = {
            temperature: tempHigh[0]?.count || 0,
            turbidity: turbidHigh[0]?.count || 0,
            phLevel: phlevelHigh[0]?.count || 0
        }

        // Create the chart data
        const chartData = {
            labels: ['Hour 1', 'Hour 2', 'Hour 3'],
            datasets: [
                {
                    label: 'High Values',
                    data: [highValues.temperature, highValues.turbidity, highValues.phLevel],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    borderWidth: 1
                }
            ]
        }

        res.status(200).json(chartData)

    } catch (error) {
        res.status(500).json({message: 'Cannot get all the request'})
    }
}



module.exports = { highParameters }