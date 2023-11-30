import React, { useState, useEffect } from 'react';
import '../../styles/SingleMetric.css';
import TollRoundedIcon from '@mui/icons-material/TollRounded';
import moment from 'moment';

const TurbidityNext = () => {
  const [predictions, setPredictions] = useState([]);
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
      
          // Append the new data to the existing predictions and then filter the last 5
          setPredictions(prevPredictions => {
            const updatedPredictions = [...prevPredictions, ...formattedData];
            return updatedPredictions.slice(-5);  // Keep only the 5 most recent predictions
          });
      
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
  

  return (
    <div>
      <div className="predictions-container">
        {predictions.length > 0 ? (
          predictions.map((predict, index) => (
            <div key={index} 
                 className="prediction" 
                 style={{ margin: 'auto' }}>
               <TollRoundedIcon style={{ color: '#8cacff' }} />
              <p className='Results'>{parseFloat(predict.value).toFixed(2)}</p>
              <p className='Days'>{moment.utc(predict.timestamp).format('ddd, MMM D, YYYY')}</p>
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
