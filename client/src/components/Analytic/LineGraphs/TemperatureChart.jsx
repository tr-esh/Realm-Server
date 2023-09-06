import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TemperatureChart = () => {
  const [temperatureData, setTemperatureData] = useState([]);

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch('/api/realm/alldata'); // Replace with your API endpoint
        const data = await response.json();
        

        let recordHigh = data[0];
        let recordLow = data[0];

        data.forEach(tempReading => {
          if (tempReading.temperature_value > recordHigh.temperature_value) {
            recordHigh = tempReading;
          }
          if (tempReading.temperature_value < recordLow.temperature_value) {
            recordLow = tempReading;
          }
        });

         
        
      // Define the range for random intervals (adjust as needed)
      const rangeStart = recordLow.temperature_value;
      const rangeEnd = recordHigh.temperature_value;

      // Function to generate a random number within a given range
      const getRandomNumberInRange = (min, max) => {
        return Math.random() * (max - min) + min;
      };

        // Sort the data array based on the difference between each temperature value and the recorded high/low
         const additionalData = [];
      for (let i = 0; i < 3; i++) {
        const randomInterval = getRandomNumberInRange(rangeStart, rangeEnd);

        // Find the data point closest to the random interval
        const closestData = data.reduce((prev, curr) => {
          const prevDiff = Math.abs(prev.temperature_value - randomInterval);
          const currDiff = Math.abs(curr.temperature_value - randomInterval);
          return currDiff < prevDiff ? curr : prev;
        });

        additionalData.push(closestData);
      }
        setTemperatureData([recordLow, ...additionalData, recordHigh]);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchTemperatureData();
  }, []);

  const tooltipStyle = {
    fontFamily: 'Poppins', // Replace with the desired font family
    fontSize: '0.9rem',
    fontWeight: '500',
    backgroundColor: '#0d2135',
    border: 'none'
  };
  

  return (
    <div  style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <ResponsiveContainer>
      <LineChart data={temperatureData}>
        <XAxis dataKey="date" />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="temperature_value" name="Temperature" stroke="#8884d8" strokeWidth={3} dot={{ r: 3 }} />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
