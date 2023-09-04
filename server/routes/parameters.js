const express = require('express')
const { postTemperature, postTurbidity, postpHLevel, getTemp, getTurbidity, getph, getParameters, getReadings, getallData} = require('../controllers/parameterReadingsContoller');
const { fetchTemp, fetchTurbidity, fetchph, fetchParameters, getHourlyMean, fetchAbnormalParameters} = require('../controllers/gettersController');
const { allParameters, getAllParameters, barParameters } = require('../controllers/streamsController');
const { highParameters } = require('../controllers/highValue');
const { calculateAverage } = require('../controllers/calculateController');
const { fetchLatestPrediction } = require('../controllers/predictionController');
const { fetchNextPrediction } = require ('../controllers/predictNextController')
const router = express.Router()

router.get('/api', function(req, res){
    res.send("hello po");
});


//sensor-based routing
router.post('/sendtemp', postTemperature)
router.post('/sendturbidity', postTurbidity)
router.post('/sendph', postpHLevel)


//get parameters
router.get('/gettemp', getTemp)
router.get('/getturbidity', getTurbidity)
router.get('/getph', getph)
router.get('/alldata', getallData)

router.get('/getall', getParameters)


//getters 
router.get('/fetchtemp', fetchTemp)
router.get('/fetchntu', fetchTurbidity)
router.get('/fetchph', fetchph)

router.get('/fetchParameters', allParameters)
router.get('/fetchAllParameters', getAllParameters)
router.get('/bardata', highParameters)

router.get('/monthdata', fetchParameters)
router.get('/abnormalparam', fetchAbnormalParameters)
router.get('/calcuAverage', calculateAverage)


//prediction
router.get('/predictions/:metricType', fetchLatestPrediction);
router.get('/predictnext/:metricType', fetchNextPrediction);


module.exports = router 