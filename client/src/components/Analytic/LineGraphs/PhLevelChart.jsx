import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PhLevelChart = () => {
  const [phData, setPhData] = useState([]);

  useEffect(() => {
    const fetchPhData = async () => {
      try {
        const response = await fetch('/api/realm/getph'); // Replace with your API endpoint
        const data = await response.json();
        

        let recordHigh = data[0];
        let recordLow = data[0];

        data.forEach(phReading => {
          if (phReading.ph_value > recordHigh.ph_value) {
            recordHigh = phReading;
          }
          if (phReading.ph_value < recordLow.ph_value) {
            recordLow = phReading;
          }
        });
        console.log(recordHigh)
         
        
      // Define the range for random intervals (adjust as needed)
      const rangeStart = recordLow.ph_value;
      const rangeEnd = recordHigh.ph_value;

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
          const prevDiff = Math.abs(prev.ph_value - randomInterval);
          const currDiff = Math.abs(curr.ph_value - randomInterval);
          return currDiff < prevDiff ? curr : prev;
        });

        additionalData.push(closestData);
      }
        setPhData([recordLow, ...additionalData, recordHigh]);
      } catch (error) {
        console.error('Error:', error);
      }
    };
   
    fetchPhData();
  }, []);

  return (
    <div  style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <ResponsiveContainer>
      <LineChart data={phData}>
        <XAxis dataKey="date" />
        <Tooltip />
        <Line type="monotone" dataKey="ph_value" name="pH Level" stroke="#F5D087" strokeWidth={3} dot={{ r: 3 }} />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PhLevelChart;
