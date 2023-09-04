const TemperatureReading = require('../models/temperatureModel')
const TurbidityReading = require('../models/turbidityModel')
const phLevelReading = require('../models/phLevelModel')

// const getallData = async (req, res) => {
    
//   try {
//       const temp = await TemperatureReading.find({}).sort({createdAt: -1})
//       const turbid = await TurbidityReading.find({}).sort({createdAt: -1})
//       const ph = await phLevelReading.find({}).sort({createdAt: -1})

//      const Params = [...temp, ...turbid, ...ph]
    

//       res.status(200).json(Params)
      
//   } catch (error) {
//       res.status(500).json({message: 'Cannot get all the request'})
//   }    
// }

const getallData = async (req, res) => {
  try {
    const temp = await TemperatureReading.find({}).sort({ createdAt: -1 });
    const turbid = await TurbidityReading.find({}).sort({ createdAt: -1 });
    const ph = await phLevelReading.find({}).sort({ createdAt: -1 });

    // Add type property to each item in the arrays to differentiate between data types
    const tempData = temp.map(item => ({ ...item.toObject(), type: 'TEMPERATURE' }));
    const turbidData = turbid.map(item => ({ ...item.toObject(), type: 'TURBIDITY' }));
    const phData = ph.map(item => ({ ...item.toObject(), type: 'PH' }));

    // Merge the arrays
    const Params = [...tempData, ...turbidData, ...phData];

    res.status(200).json(Params);
  } catch (error) {
    res.status(500).json({ message: 'Cannot get all the request' });
  }
};



// const getallData = async (req, res) => {   
//   try {
//     const temp = await TemperatureReading.find({}).sort({createdAt: -1})
//     const turbid = await TurbidityReading.find({}).sort({createdAt: -1})
//     const ph = await phLevelReading.find({}).sort({createdAt: -1})

//     const Params = {
//       temperature: temp, 
//       turbidity: turbid, 
//       ph: ph
//     }

//     res.status(200).json(Params)
      
//   } catch (error) {
//     res.status(500).json({message: 'Cannot get all the request'})
//   }    
// }



// const getallData = async (req, res) => {
//   try {
//     const tempPromise = TemperatureReading.find({}).sort({ createdAt: -1 }).lean().exec();
//     const turbidPromise = TurbidityReading.find({}).sort({ createdAt: -1 }).lean().exec();
//     const phPromise = phLevelReading.find({}).sort({ createdAt: -1 }).lean().exec();

//     const [temp, turbid, ph] = await Promise.all([tempPromise, turbidPromise, phPromise]);

//     const Params = { temperature: temp, turbidity: turbid, ph: ph };

//     res.status(200).json(Params);
//   } catch (error) {
//     res.status(500).json({ message: 'Cannot get all the request' });
//   }
// };



function isTemperatureValid(temperature) {
  // Check if temperature is within valid range
  return temperature >= 0 && temperature <= 50;
}

function isTurbidityValid(turbidity) {
  // Check if turbidity is within valid range
  return turbidity >= 0 && turbidity <= 3000;
}

function isPhValueValid(phValue) {
  // Check if pH value is within valid range
  return phValue >= 0 && phValue <= 14;
}


let promiseChain = Promise.resolve();

const postTemperature = async (req, res) => {
    const { IoT_module, sensor_code, sensor_type, parameter_name, temperature_value, status } = req.body
  
    if (!isTemperatureValid(temperature_value)) {
      return res.status(400).json({ error: "Temperature value is outside of valid range" });
    }
  
    // Remove special characters from status
    const cleanedStatus = status.replace(/[^a-zA-Z0-9: ]/g, "");

     // Check if cleanedStatus contains numeric characters
    if (/\d/.test(cleanedStatus)) {
        return res.status(400).json({ error: "Status contains numeric characters" });
      }
  
    const reading = { IoT_module, sensor_code, sensor_type, parameter_name, temperature_value, status: cleanedStatus };
  
    promiseChain = promiseChain.then(() => TemperatureReading.create(reading));
  
    return promiseChain
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(400).json({ error: error.message });
      });
  };
  
  const postTurbidity = async (req, res) => {
    const { IoT_module, sensor_code, sensor_type, parameter_name, ntu_value, status } = req.body
  
    if (!isTurbidityValid(ntu_value)) {
      return res.status(400).json({ error: "Turbidity value is outside of valid range" });
    }
  
    // Remove special characters from status
    const cleanedStatus = status.replace(/[^a-zA-Z0-9: ]/g, "");

     // Check if cleanedStatus contains numeric characters
    if (/\d/.test(cleanedStatus)) {
        return res.status(400).json({ error: "Status contains numeric characters" });
      }
  
    const reading = { IoT_module, sensor_code, sensor_type, parameter_name, ntu_value, status: cleanedStatus };
  
    promiseChain = promiseChain.then(() => TurbidityReading.create(reading));
  
    return promiseChain
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(400).json({ error: error.message });
      });
  };
  
  const postpHLevel = async (req, res) => {
    const { IoT_module, sensor_code, sensor_type, parameter_name, ph_value, status } = req.body
  
    if (!isPhValueValid(ph_value)) {
      return res.status(400).json({ error: "pH value is outside of valid range" });
    }
  
    // Remove special characters from status
    const cleanedStatus = status.replace(/[^a-zA-Z0-9: ]/g, "");

    // Check if cleanedStatus contains numeric characters
    if (/\d/.test(cleanedStatus)) {
        return res.status(400).json({ error: "Status contains numeric characters" });
      }
  
    const reading = { IoT_module, sensor_code, sensor_type, parameter_name, ph_value, status: cleanedStatus };
  
    promiseChain = promiseChain.then(() => phLevelReading.create(reading));
  
    return promiseChain
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        res.status(400).json({ error: error.message });
      });
  };
  

const getParameters = async (req, res) => {
    
    try {
        const temp = await TemperatureReading.find({status: /^Warning: Rising Temperature/}).sort({createdAt: -1})
        const turbid = await TurbidityReading.find({status: /^Warning: High Turbid/}).sort({createdAt: -1})
        const ph = await phLevelReading.find({status: /^Caution: Acidic/}).sort({createdAt: -1})

       const Params = [...temp, ...turbid, ...ph]
      
          

        res.status(200).json(Params)
        
    } catch (error) {
        res.status(500).json({message: 'Cannot get all the request'})
    }    
}




const getTemp = async (req, res) => {
        
        const temp = await TemperatureReading.find({}).sort({createdAt: -1})
        res.status(200).json(temp)
}

const getTurbidity = async (req, res) => {
    
        const turbid = await  TurbidityReading.find({}).sort({createdAt: -1})
        res.status(200).json(turbid)
}

const getph = async (req, res) => {
        
    const phlevel = await phLevelReading.find({}).sort({createdAt: -1})
    res.status(200).json(phlevel)
}

// const getReadings = async (req, res) => {
//   const temp = await TemperatureReading.find({}).sort({createdAt: -1});
//   const turbid = await TurbidityReading.find({}).sort({createdAt: -1});
//   const phlevel = await phLevelReading.find({}).sort({createdAt: -1});
  
//   const readings = [...temp, ...turbid, ...phlevel];

//   // Update the Firebase Realtime Database with the latest readings
//   const db = admin.database();

//   const updates = {};

//   // Update the temperature reading
//   const latestTemp = temp[0]?.value; // Assumes that the value is stored in a "value" field
//   try{ 
//     if (latestTemp !== null && latestTemp !== undefined) {
//     console.log('Latest temperature:', latestTemp);
//     updates['readings/temperature'] = latestTemp;
//     } 
//     }catch (error) {
//     console.error('Error updating temperature:', error);
//   }

//   // Update the turbidity reading
//   const latestTurbid = turbid[0]?.value; // Assumes that the value is stored in a "value" field
//   if (latestTurbid !== null && latestTurbid !== undefined) {
//     console.log('Latest turbidity:', latestTurbid);
//     updates['readings/turbidity'] = latestTurbid;
//   }

//   // Update the pH level reading
//   const latestPhLevel = phlevel[0]?.value; // Assumes that the value is stored in a "value" field
//   if (latestPhLevel !== null && latestPhLevel !== undefined) {
//     console.log('Latest pH level:', latestPhLevel);
//     updates['readings/phLevel'] = latestPhLevel;
//   }

//   if (Object.keys(updates).length > 0) {
//     await db.ref().update(updates);
//     console.log('Readings updated in Firebase');
//   }

//   res.status(200).json(readings);
// };



module.exports = { postTemperature, postTurbidity, postpHLevel, getTemp, getTurbidity, getph, getParameters, getallData }