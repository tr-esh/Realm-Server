import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TurbidityChart = () => {
  const [turbidityData, setTurbidityData] = useState([]);

  useEffect(() => {
    const fetchTurbidityData = async () => {
      try {
        const response = await fetch('/api/realm/getturbidity'); // Replace with your API endpoint
        const data = await response.json();
        

        let recordHigh = data[0];
        let recordLow = data[0];

        data.forEach(ntuReading => {
          if (ntuReading.ntu_value > recordHigh.ntu_value) {
            recordHigh = ntuReading;
          }
          if (ntuReading.ntu_value < recordLow.ntu_value) {
            recordLow = ntuReading;
          }
        });

         
        
      // Define the range for random intervals (adjust as needed)
      const rangeStart = recordLow.ntu_value;
      const rangeEnd = recordHigh.ntu_value;

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
          const prevDiff = Math.abs(prev.ntu_value - randomInterval);
          const currDiff = Math.abs(curr.ntu_value - randomInterval);
          return currDiff < prevDiff ? curr : prev;
        });

        additionalData.push(closestData);
      }
        setTurbidityData([recordLow, ...additionalData, recordHigh]);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchTurbidityData();
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
      <LineChart data={turbidityData}>
        <XAxis dataKey="date" />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="ntu_value" name="Turbidity" stroke="#F1918F" strokeWidth={3} dot={{ r: 3 }} />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TurbidityChart;
