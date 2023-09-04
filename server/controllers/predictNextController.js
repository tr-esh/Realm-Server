const PredictNext = require('../models/predictNextModel');

const fetchNextPrediction = async (req, res) => {
    
    try {
        const metricType = req.params.metricType;
        
        const predictions = await PredictNext.aggregate([
            { $match: { metricType } }, // Filter by the metricType
            { $unwind: '$values' } // Unwind the values array
        ]);

        if (!predictions.length) {
            return res.status(404).send({ message: 'Predictions not found' });
        }

        res.send(predictions); // Send all predictions
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
};

module.exports = { fetchNextPrediction };
