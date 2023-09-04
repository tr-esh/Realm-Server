import React, { useState, useEffect } from 'react';
import '../../styles/SingleMetric.css';
import Lottie from 'react-lottie-player';
import circleOutlineAnimation from '../../../img/wired-outline-447-water-yellow-drop.json';  // Replace with the path to your downloaded Lottie file
import loderAnimation from '../../../img/wired-outline-105-loader-1.json';  // Replace with the path to your downloaded Lottie file

const PhHome = () => {
  const [prediction, setPrediction] = useState(null); // Initialize as null
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/realm/predictnext/ph');
        const jsonData = await response.json();

        if (jsonData.length > 0) {
          // Find the prediction for tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);

          const tomorrowPrediction = jsonData.find((prediction) => {
            const predictionDate = new Date(prediction.values.timestamp);
            return predictionDate >= tomorrow;
          });

          if (tomorrowPrediction) {
            const formattedData = {
              value: tomorrowPrediction.values.value,
              timestamp: tomorrowPrediction.values.timestamp,
            };
            setPrediction(formattedData);
          } else {
            setError('No prediction available for tomorrow.');
          }
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
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('en-PH', options).format(date);
  };

  return (
    <div>
      <div className="predictHome-container">
        {prediction ? (
          <div className="predic" style={{ margin: 'auto' }}>
            <Lottie
              animationData={circleOutlineAnimation}
              play
              loop
              style={{ width: 40, height: 40, margin: 'auto' }}  // Adjust the width and height as needed
            />
            <p className='home-result'>{parseFloat(prediction.value).toFixed(2)} pH</p>
            <p className='home-days'>{formatDate(prediction.timestamp)}</p>
          </div>
        ) : error ? (
          <p className='error-state'>{error}</p>
        ) : (
          <p className='home-load' style={{marginTop: '1.5rem'}}>
                                      <Lottie
                                      animationData={loderAnimation}
                                      play
                                      loop
                                      style={{ width: 40, height: 40, margin: 'auto' }}  // Adjust the width and height as needed
                                    />
                              </p>
        )}
      </div>
    </div>
  );
};

export default PhHome;
