const express = require('express')
const { postTemperature, postTurbidity, postpHLevel, getTemp, getTurbidity, getph, getParameters, getReadings} = require('../controllers/parameterReadingsContoller');
const { fetchTemp, fetchTurbidity, fetchph, fetchParameters, getHourlyMean} = require('../controllers/gettersController');
const { allParameters, getAllParameters, barParameters } = require('../controllers/streamsController');
const { highParameters } = require('../controllers/highValue');

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

router.get('/getall', getParameters)



//getters 
router.get('/fetchtemp', fetchTemp)
router.get('/fetchntu', fetchTurbidity)
router.get('/fetchph', fetchph)

router.get('/fetchParameters', allParameters)
router.get('/fetchAllParameters', getAllParameters)
router.get('/bardata', highParameters)

router.get('/monthdata', fetchParameters)



module.exports = router 