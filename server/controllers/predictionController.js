const PredictionsModel = require('../models/predictionModel');

const fetchLatestPrediction = async (req, res) => {
    try {
        const metricType = req.params.metricType;
        
        const predictions = await PredictionsModel.aggregate([
            { $match: { metricType } }, // Filter by the metricType
            { $unwind: '$values' },     // Unwind the values array
            { $sort: { "values.timestamp": -1 } },  // Sort by timestamp in descending order
        ]);

        if (!predictions.length) {
            return res.status(404).send({ message: 'Predictions not found' });
        }

        res.send(predictions); 
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
};

module.exports = { fetchLatestPrediction }