import React, { useState, useEffect } from 'react';
import '../../styles/SingleMetric.css';
import TollRoundedIcon from '@mui/icons-material/TollRounded';

const TurbidityNext = () => {
  const [predictions, setPredictions] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/realm/predictnext/turbidity');
        const jsonData = await response.json();

        if (jsonData.length > 0) {
          const formattedData = jsonData.map(item => ({
            value: item.values.value,
            timestamp: item.values.timestamp
          }));

          // Append the new data to the existing predictions
          setPredictions(prevPredictions => [
            ...prevPredictions,
            ...formattedData
          ]);

          // Keep only the 5 most recent predictions
          setPredictions(prevPredictions =>
            prevPredictions.slice(-5)
          );
        } else {
          setError('Prediction data is not available.');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching data.');
      }
    }
    fetchData();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString();
  };

  return (
    <div>
      <div className="predictions-container">
        {predictions.length > 0 ? (
          predictions.map((predict, index) => (
            <div key={index} className="prediction" style={{ margin: 'auto' }}>
               <TollRoundedIcon style={{color: '#F1918F'}} />
              <p className='Results'>{parseFloat(predict.value).toFixed(2)}</p>
              <p className='Days'>{formatDate(predict.timestamp)}</p>
            </div>
          ))
        ) : error ? (
          <p className='error-state'>{error}</p>
        ) : (
          <p className='loading-state'><span className="loading-animation"></span></p>
        )}
      </div>
    </div>
  );
};
export default TurbidityNext;
