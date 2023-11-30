const TemperatureReading = require('../models/temperatureModel')
const TurbidityReading = require('../models/turbidityModel')
const phLevelReading = require('../models/phLevelModel')


const getallData = async (req, res) => {
  try {
    const temp = await TemperatureReading.find({}).sort({ createdAt: -1 });
    const turbid = await TurbidityReading.find({}).sort({ createdAt: -1 });
    const ph = await phLevelReading.find({}).sort({ createdAt: -1 });

    // Add type property to each item in the arrays to differentiate between data types
    const tempData = temp.map(item => 
      ({ ...item.toObject(),
         type: 'TEMPERATURE' })
    );

    const turbidData = turbid.map(item => 
      ({ ...item.toObject(),
         type: 'TURBIDITY' })
    );

    const phData = ph.map(item => 
      ({ ...item.toObject(),
         type: 'PH' })
    );

    // Merge the arrays
    const Params = [...tempData, ...turbidData, ...phData];

    res.status(200).json(Params);
  } catch (error) {
    res.status(500).json({ message: 'Cannot get all the request' });
  }
};


const getMostFrequentData = async (Model, valueField) => {
  return Model.aggregate([
    {
      $group: {
        _id: {
          date: { $dateToString: 
            { format: "%Y-%m-%d", 
              date: "$createdAt" } 
          },
          value: `$${valueField}`
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $group: {
        _id: "$_id.date",
        value: { $first: "$_id.value" },
        count: { $first: "$count" }
      }
    },
    {
      $sort: { _id: -1 } // Sort by date (most recent first)
    }
  ]);
};

const getallFrequentData = async (req, res) => {
  try {
    const temp = await getMostFrequentData(TemperatureReading, 'temperature_value'); 
    const turbid = await getMostFrequentData(TurbidityReading, 'ntu_value');
    const ph = await getMostFrequentData(phLevelReading, 'ph_value');

    const tempData = temp.map(item => 
      ({ date: item._id,
         value: item.value,
         count: item.count,
          type: 'TEMPERATURE' 
        })
      );

    const turbidData = turbid.map(item => 
      ({ date: item._id,
         value: item.value,
         count: item.count,
          type: 'TURBIDITY' 
        })
      );

    const phData = ph.map(item => 
      ({ date: item._id,
         value: item.value,
         count: item.count,
          type: 'PH' 
        })
      );

    const Params = [...tempData, ...turbidData, ...phData]
                    .sort((a, b) => new Date(b.date) - new Date(a.date));


    res.status(200).json(Params);
  } catch (error) {
    res.status(500).json({ message: 'Cannot get all the request' });
  }
};


//data cleaning functions POST
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
      const { IoT_module, 
              sensor_code,
              sensor_type, 
              parameter_name, 
              temperature_value, 
              status 
            } = req.body
    
      if (!isTemperatureValid(temperature_value)) {
        return res.status(400).json({ error: "Temperature value is outside of valid range" });
      }
    
      // Remove special characters from status
      const cleanedStatus = status.replace(/[^a-zA-Z0-9: ]/g, "");

      // Check if cleanedStatus contains numeric characters
      if (/\d/.test(cleanedStatus)) {
          return res.status(400).json({ error: "Status contains numeric characters" });
        }
    
      const reading = { IoT_module, 
                        sensor_code, 
                        sensor_type, 
                        parameter_name, 
                        temperature_value, 
                        status: cleanedStatus };
    
      promiseChain = promiseChain.then(() => 
                        TemperatureReading.create(reading)
                      );
    
      return promiseChain
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error => {
          res.status(400).json({ error: error.message });
        });
    };
    
    const postTurbidity = async (req, res) => {
      const { IoT_module, 
              sensor_code, 
              sensor_type, 
              parameter_name, 
              ntu_value, 
              status 
            } = req.body
    
      if (!isTurbidityValid(ntu_value)) {
        return res.status(400).json({ error: "Turbidity value is outside of valid range" });
      }
    
      // Remove special characters from status
      const cleanedStatus = status.replace(/[^a-zA-Z0-9: ]/g, "");

      // Check if cleanedStatus contains numeric characters
      if (/\d/.test(cleanedStatus)) {
          return res.status(400).json({ error: "Status contains numeric characters" });
        }
    
      const reading = { IoT_module, 
                        sensor_code, 
                        sensor_type, 
                        parameter_name, 
                        ntu_value, 
                        status: cleanedStatus };
    
      promiseChain = promiseChain.then(() => 
                        TurbidityReading.create(reading)
                      );
    
      return promiseChain
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error => {
          res.status(400).json({ error: error.message });
        });
    };
    
    const postpHLevel = async (req, res) => {
      const { IoT_module, 
              sensor_code, 
              sensor_type, 
              parameter_name, 
              ph_value, 
              status 
            } = req.body
    
      if (!isPhValueValid(ph_value)) {
        return res.status(400).json({ error: "pH value is outside of valid range" });
      }
    
      // Remove special characters from status
      const cleanedStatus = status.replace(/[^a-zA-Z0-9: ]/g, "");

      // Check if cleanedStatus contains numeric characters
      if (/\d/.test(cleanedStatus)) {
          return res.status(400).json({ error: "Status contains numeric characters" });
        }
    
      const reading = { IoT_module, 
                        sensor_code, 
                        sensor_type, 
                        parameter_name, 
                        ph_value, 
                        status: cleanedStatus 
                      };
    
      promiseChain = promiseChain.then(() => 
                        phLevelReading.create(reading)
                      );
    
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
        const temp = await TemperatureReading
                          .find({status: /^Warning: Rising Temperature/})
                          .sort({createdAt: -1})

        const turbid = await TurbidityReading
                            .find({status: /^Warning: High Turbid/})
                            .sort({createdAt: -1})
                            
        const ph = await phLevelReading
                        .find({status: /^Caution: Acidic/})
                        .sort({createdAt: -1})

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



module.exports = { postTemperature, postTurbidity, postpHLevel, getTemp, getTurbidity, getph, getParameters, getallData, getallFrequentData }
