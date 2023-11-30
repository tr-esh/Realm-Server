import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AccuracyRate = () => {

    const [progress, setProgress] = useState({
        temperature: 0,
        turbidity: 0,
        pH: 0,
    });

    const [accuracyData, setAccuracyData] = useState({
        timestamp: '',
        temperature: 0,
        turbidity: 0,
        pH: 0,
    });

    const sendDataToBackend = async () => {
        try {
            const response = await fetch('/api/realm/sendAccuracyRate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(accuracyData)
            });
            const data = await response.json();

            if(response.status === 409) { 
                console.warn(data.message);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    useEffect(() => {
        if (accuracyData.timestamp) { // To avoid sending the initial empty state
            console.log("Sending accuracy data:", accuracyData);
            sendDataToBackend();
        }
    }, [accuracyData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/realm/alldata');
                const responseData = await response.json();

                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);

                const formattedYesterday = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
                const yesterdayData = responseData.filter(data => data.createdAt.split('T')[0] === formattedYesterday);

                const mostFrequentTemp = getMostFrequentValue(yesterdayData, 'temperature');
                const mostFrequentTurbid = getMostFrequentValue(yesterdayData, 'turbidity');
                const mostFrequentPh = getMostFrequentValue(yesterdayData, 'pH');

                const tempAccuracy = await fetchPredictedValueAndCalculateAccuracy('temperature', mostFrequentTemp, formattedYesterday);
                const turbidAccuracy = await fetchPredictedValueAndCalculateAccuracy('turbidity', mostFrequentTurbid, formattedYesterday);
                const phAccuracy = await fetchPredictedValueAndCalculateAccuracy('ph', mostFrequentPh, formattedYesterday);

                setAccuracyData({
                    timestamp: formattedYesterday,
                    temperature: tempAccuracy,
                    turbidity: turbidAccuracy,
                    pH: phAccuracy,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const getMostFrequentValue = (data, type) => {
      let valueField;
      switch (type) {
          case 'temperature':
              valueField = 'temperature_value';
              break;
          case 'turbidity':
              valueField = 'ntu_value';
              break;
          case 'pH':
              valueField = 'ph_value';
              break;
          default:
              throw new Error(`Unknown type: ${type}`);
      }
  
      const typeData = data.filter(d => d.parameter_name === type);
      const frequency = {};
  
      typeData.forEach(d => {
          if (frequency[d[valueField]]) {
              frequency[d[valueField]]++;
          } else {
              frequency[d[valueField]] = 1;
          }
      });
  
      if (Object.keys(frequency).length === 0) {
          return 0;  // Return 0 or a suitable default value.
      }
  
      let mostFrequentValue = Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
      return parseFloat(mostFrequentValue);
  };
  
  
  const fetchPredictedValueAndCalculateAccuracy = async (metricType, actualValue, formattedYesterday) => {
    const response = await fetch(`/api/realm/predictnext/${metricType}`);
    const predictionsArray = await response.json();

    const predictionsForDate = predictionsArray.filter(prediction => {
        // First convert the string timestamp to a Date object
        const predictionDateUTC = new Date(prediction.values.timestamp);
        
        const predictionDate = new Date(Date.UTC(
            predictionDateUTC.getUTCFullYear(), 
            predictionDateUTC.getUTCMonth(), 
            predictionDateUTC.getUTCDate()
        ));
        
        const formattedUTCDate = `${predictionDate.getUTCFullYear()}-${String(predictionDate.getUTCMonth() + 1).padStart(2, '0')}-${String(predictionDate.getUTCDate()).padStart(2, '0')}`;
        
        return formattedUTCDate === formattedYesterday;
    });

    if (!predictionsForDate.length) {
        console.error(`No prediction found for date: ${formattedYesterday}`);
        return 0;  // Or a suitable default value.
    }

    predictionsForDate.sort((a, b) => new Date(b.values.timestamp) - new Date(a.values.timestamp));
    
    const predictedValueForDate = predictionsForDate[0].values.value;


    return calculateAccuracy(predictedValueForDate, actualValue);
};

  
const calculateAccuracy = (predicted, actual) => {
  if (typeof predicted !== "number" || typeof actual !== "number" || actual === 0) {
      console.error('Invalid values for accuracy calculation:', predicted, actual);
      return 0;  // Return 0% accuracy if the data is not valid.
  }
  let accuracy = (1 - Math.abs(predicted - actual) / actual) * 100;
  return Math.max(0, accuracy);
};

  
  
  useEffect(() => {
    const interval = setInterval(() => {
        setProgress(prev => {
            return {
                temperature: parseFloat(Math.min(prev.temperature + 1, accuracyData.temperature).toFixed(2)),
                turbidity: parseFloat(Math.min(prev.turbidity + 1, accuracyData.turbidity).toFixed(2)),
                pH: parseFloat(Math.min(prev.pH + 1, accuracyData.pH).toFixed(2))
            }
        });
        if (progress.temperature >= accuracyData.temperature && progress.turbidity >= accuracyData.turbidity && progress.pH >= accuracyData.pH) {
            clearInterval(interval);
        }
    }, 50);

    return () => clearInterval(interval);
}, [accuracyData]);


  
const generateProgressBar = (paramProgress, paramName) => {
    const filledWidth = (paramProgress / 100) * 100 + '%';
    const progressBarStyle = {
      width: '100%',
      height: '0.3rem',
      background: `linear-gradient(to right, #8cacff ${filledWidth}, #0d2135 ${filledWidth})`,
      borderRadius: '2rem'
    };

    return (
      <Link to={`/AssessMain/${paramName.toLowerCase()}`} key={paramName} style={{ textDecoration: 'none' }}>
        <div style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '0.8rem', 
                      paddingLeft: '0.5rem', 
                      paddingTop: '0.5rem',
                      textTransform: 'uppercase', 
                      fontWeight: '500', 
                      color: '#C7C7C7',
                      fontFamily: 'Sk-Modernist-Regular' }}>
            {paramName}
          </p>
          <div className="progress-bar" style={{ padding: '1rem' }}>
            <div className="progress-bar-fill" style={progressBarStyle}></div>
            <div className="progress-bar-label" 
                 style={{ fontSize: '0.8rem',
                          paddingTop: '0.5rem', 
                          color: '#4B6075' }}>
                         {`${paramProgress}% accuracy of 100`}
            </div>
          </div>
        </div>
      </Link>
    );
  }
  
    return (
      <div>
        {generateProgressBar(progress.temperature, 'Temperature')}
        {generateProgressBar(progress.turbidity, 'Turbidity')}
        {generateProgressBar(progress.pH, 'pH')}
      </div>
    );
  };

export default AccuracyRate;
