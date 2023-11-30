import React, { useState, useEffect } from 'react';
import '../../styles/SingleMetric.css';
import Lottie from 'react-lottie-player';
import circleOutlineAnimation from '../../../img/wired-outline-447-water-pink-drop.json';  
import loderAnimation from '../../../img/wired-outline-105-loader-1.json'; 
import moment from 'moment';

const TurbidityHome = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [nextDayPrediction, setNextDayPrediction] = useState(null);

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
            const latestFivePredictions = updatedPredictions.slice(-5);  // Keep only the 5 most recent predictions

            // Find the prediction for the day after the current day
            const tomorrow = moment().utc().add(1, 'day').startOf('day'); // Get the start of the day after today

            const nextDayPrediction = latestFivePredictions.find(prediction => {
              const predictionDate = moment.utc(prediction.timestamp);
              return predictionDate.isSame(tomorrow, 'day');
            });

            // Store the prediction for the day after the current day in a state variable
            setNextDayPrediction(nextDayPrediction);

            return latestFivePredictions;
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

  const formatDate = (timestamp) => {
    return moment.utc(timestamp).format('dddd');
  };

  return (
    <div className="predictHome-container">
        {nextDayPrediction ? (
            <div className="predic" style={{ margin: 'auto' }}>
            <Lottie
                animationData={circleOutlineAnimation}
                play
                loop
                style={{ width: 40, height: 40, margin: 'auto' }}
            />
            {/* Display data for the day after the current day */}
            <p className='home-result'>{parseFloat(nextDayPrediction.value).toFixed(2)} NTU</p>
            <p className='home-days'>{formatDate(nextDayPrediction.timestamp)}</p>
            
            </div>
        ) : error ? (
            <p className='error-state'>{error}</p>
        ) : (
            <p className='home-load' style={{ marginTop: '1.5rem' }}>
            <Lottie
                animationData={loderAnimation}
                play
                loop
                style={{ width: 40, height: 40, margin: 'auto' }}
            />
            </p>
        )}
    </div>
  );
};

export default TurbidityHome;
