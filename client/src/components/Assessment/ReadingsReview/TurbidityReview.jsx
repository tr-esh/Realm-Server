import React, { useState, useEffect } from 'react';
import '../../styles/SingleMetric.css';
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded';




const TurbidityReview = () => {

  const [error, setError] = useState(null);
  const [dataSet, setDataSet] = useState({});


  useEffect(() => {
    async function fetchData() {
      const today = new Date();
      const daysAgo = [1, 2, 3, 4, 5, 6];  // This gives the desired order.
      let ntuDataSet = {};
  
      const fetchDateFromTimestamp = timestamp => {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
        console.error("Invalid timestamp:", timestamp);
        return null;  // If the date is invalid, return null.
    };
    
    
  
      // Fetch all data outside of the loop to minimize repeated API calls.
      const responsePredict = await fetch('/api/realm/predictnext/turbidity');
      const jsonDataPredict = await responsePredict.json();
      const responseActual = await fetch('/api/realm/getfrequentdata');
      const jsonDataActual = await responseActual.json();
      const responseAccuracy = await fetch('/api/realm/accuracydata');
      const jsonDataAccuracy = await responseAccuracy.json();
  
      for (const days of daysAgo) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - days);
      
        const targetDateKey = fetchDateFromTimestamp(targetDate);
      
        if (!targetDateKey) continue; // Skip the current iteration if targetDateKey is null.
      
        if (!ntuDataSet[targetDateKey]) {
          ntuDataSet[targetDateKey] = {
            prediction: null,
            actual: null,
            accuracy: null,
          };
        }
      
        // Match Prediction Data
        const matchedPredictData = jsonDataPredict
          .filter(item => fetchDateFromTimestamp(item.values.timestamp) === fetchDateFromTimestamp(targetDate.toISOString()))
          .sort((a, b) => new Date(b.values.timestamp) - new Date(a.values.timestamp))
          .shift(); // Select the latest prediction data
      
        if (matchedPredictData) {
          ntuDataSet[targetDateKey].prediction = matchedPredictData.values.value;
        }
      
        // Matching Actual Data
        const matchedActualData = jsonDataActual
          .filter(item => item.type === 'TURBIDITY' && fetchDateFromTimestamp(item.date) === fetchDateFromTimestamp(targetDate.toISOString()))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .shift(); // Select the latest actual data
      
        if (matchedActualData) {
          ntuDataSet[targetDateKey].actual = matchedActualData.value;
        }
      
        // Matching Accuracy Data
        const matchedAccuracyData = jsonDataAccuracy
          .filter(item => fetchDateFromTimestamp(item.timestamp) === fetchDateFromTimestamp(targetDate.toISOString()))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .shift(); // Select the latest accuracy data
      
        if (matchedAccuracyData) {
          ntuDataSet[targetDateKey].accuracy = matchedAccuracyData.turbidity;
        }
      }
  
      const sortedDataSet = Object.entries(ntuDataSet)
    .filter(([key]) => key)  // Ensure that the key exists.
    .sort(([a], [b]) => new Date(b) - new Date(a))
    .reduce((acc, [date, value]) => {
        acc[date] = value;
        return acc;
    }, {});

  
      console.log(sortedDataSet);
      setDataSet(sortedDataSet);
  }
  
    fetchData();
  }, []);

  const formatDateDisplay = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short'
    });
};


  

  return (
    <div>
    {Object.keys(dataSet).length > 0 ? (
      <div
        style={{
          
          color: 'white',
          borderRadius: '1rem',
          maxHeight: '400px',
          
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(49, 87, 123, 1)',
            color: 'white',
            top: 0,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Sk-Modernist-Regular',
            fontSize: '1rem',
            textAlign: 'center',
            padding: '15px',
            borderRadius: '2rem',
            marginBottom: '0.5rem',
            marginTop: '0.5rem'
          }}
        >
          <div style={{ flex: 1.1 }}>Date</div>
          <div style={{ flex: 1 }}>Predictions</div>
          <div style={{ flex: 1 }}>Actual Data</div>
          <div style={{ flex: 1 }}>Acuracy Rate</div>
        </div>
        {Object.entries(dataSet).map(([date, data], index) => (
          <div
              key={index}
              style={{
                borderRadius: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'Sk-Modernist-Regular',
                padding: '15px',
                fontWeight: index === 0 ? '600' : '300' ,
                backgroundColor: index === 0 ? '#0A1929' : '#193450'
              }}
              className="rounded-table-row"
            >
               <BookmarkAddedRoundedIcon 
                 style={{fontSize: '1.5rem', 
                         color: '#8cacff', 
                         marginLeft: '0.5rem'}}
              />
              <div style={{ flex: 0.9 }}>
                {formatDateDisplay(date)}
              </div>
              <div style={{ flex: 1 }}>
                {data.prediction ? parseFloat(data.prediction).toFixed(2) : ''}
              </div>
              <div style={{ flex: 1 }}>
                {data.actual ? parseFloat(data.actual).toFixed(2) : 'NaN'}
              </div>
              <div style={{ flex: 1 }} className= 'accuracy-style'>
                {data.accuracy ? `${parseFloat(data.accuracy).toFixed(2)}%` : '0%'}
              </div>

          </div>
        ))}
      </div>
    ) : error ? (
      <p className="error-state">{error}</p>
    ) : (
      <p className="loading-state">
        <span className="loading-animation"></span>
      </p>
    )}
  </div>

  );
};

export default TurbidityReview;
