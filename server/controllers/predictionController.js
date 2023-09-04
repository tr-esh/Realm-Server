const PredictionsModel = require('../models/predictionModel');

const fetchLatestPrediction = async (req, res) => {
    try {
        const predictions = await PredictionsModel.findOne({ metricType: req.params.metricType }).sort({ timestamp: -1 }).limit(1);
        if (!predictions) {
            return res.status(404).send({ message: 'Predictions not found' });
        }

        res.send(predictions);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
};

module.exports = { fetchLatestPrediction }