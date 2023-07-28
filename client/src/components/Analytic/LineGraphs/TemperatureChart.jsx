import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

const TemperatureChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/realm/gettemp'); // Replace '/your-endpoint' with your actual endpoint
        const responseData = await response.json();
        const temps = responseData.map(item => item.temperature_value); // Replace 'temperature' with the actual temperature field in your data
        const dates = responseData.map(item => {
          const date = new Date(item.createdAt);
          return `${date.getMonth() + 1}/${date.getFullYear()}`; // Format date as mm/yyyy
        });

        setData({
          labels: dates,
          datasets: [
            {
              label: 'Temperature',
              data: temps,
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              datalabels: {
                align: 'end',
                anchor: 'end'
              }
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data && (
        <Line
          data={data}
          options={{
            plugins: {
              datalabels: {
                color: '#000000',
                display: true
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default TemperatureChart;
