import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TurbidityPA = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [integratedDataState, setIntegratedDataState] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const predictedReadingColor = "#F1918F"; // Color for "Predicted Reading"
  const actualReadingColor = "#6F93D3";    // Color for "Actual Reading"

  const utcDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const findLastFiveConsecutiveMatches = (data) => {
    for (let i = data.length - 1; i >= 4; i--) {
        if (data.slice(i-4, i+1).every(item => item.allDataValue !== null)) {
            return i - 4;
        }
    }
    return -1;
};

const processDataForDisplay = () => {
    const startingIndex = 5 * page;
    const endIndex = startingIndex + 5;
    const displayData = integratedDataState.slice(startingIndex, endIndex);
    setChartData(displayData);
};

const fetchChartData = async () => {
  try {
      const metricType = 'turbidity';
      const predictionResponse = await fetch(`/api/realm/predictnext/${metricType}`);
      const predictionData = await predictionResponse.json();

      const actualResponse = await fetch(`/api/realm/getfrequentdata`);
      const actualData = await actualResponse.json();

      const extractedPredictionData = predictionData.map((record) => ({
          ...record,
          value: parseFloat(record.values.value).toFixed(2),
          timestamp: utcDateString(new Date(record.values.timestamp)),
      }));

      // Group the extractedPredictionData by date
      const groupedByDate = extractedPredictionData.reduce((acc, curr) => {
        if (!acc[curr.timestamp]) {
            acc[curr.timestamp] = [];
        }
        acc[curr.timestamp].push(curr);
        return acc;
    }, {});

    // Extract the most recent predicted data for each date
    const mostRecentPredictions = Object.values(groupedByDate).map(group => group[group.length - 1]);

    // Use this 'mostRecentPredictions' for further processing
    const integratedData = mostRecentPredictions.map((pred) => {
        const matchingTurbidityRecord = actualData.find(
            (record) => record.date === pred.timestamp && record.type === 'TURBIDITY'
        );

        const freqTurbidity = matchingTurbidityRecord ? 
                                matchingTurbidityRecord.value : null;

        return {
            timestamp: pred.timestamp,
            value: pred.value,
            allDataValue: freqTurbidity,
        };
    }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      setIntegratedDataState(integratedData);

      const startingIndex = findLastFiveConsecutiveMatches(integratedData);
      if (startingIndex !== -1) {
          setPage(Math.floor(startingIndex / 5));
      }

      processDataForDisplay();
      setLoading(false);
  } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
  }
};

useEffect(() => {
  fetchChartData();
}, []);

useEffect(() => {
  processDataForDisplay();
}, [page, integratedDataState]);


  const tooltipStyle = {
    fontFamily: 'Sk-Modernist-Regular',
    fontSize: '0.8rem',
    fontWeight: '500',
    backgroundColor: '#0d2135',
    border: 'none',
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload) {
      const predictedReading = payload[0]?.value || 'N/A';
      const actualReading = payload[1]?.value || 'N/A';
      
      return (
          <div style={{
              ...tooltipStyle,
              padding: '10px',
              borderRadius: '5px'
          }}>
              <p style={{ margin: 0, color: predictedReadingColor }}>
                {`Predicted Reading: ${predictedReading}`}
              </p>
              <p style={{ margin: 0, color: actualReadingColor }}>
                {`Actual Reading: ${actualReading}`}
              </p>
          </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', 
                  height: '80%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center' }}>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <ResponsiveContainer>
            <AreaChart data={chartData}
                       margin={{ top: 50, right: 0, bottom: 0, left: 0 }}>
            <XAxis 
                dataKey="timestamp" 
                fontSize={10} 
                height={50} 
                interval={'preserveStartEnd'}
                tickFormatter={(tick) => new Date(tick).toLocaleDateString
                                ('en-US', { month: 'short', day: 'numeric' })}
                tick={{ fill: 'white', fontFamily: 'Sk-Modernist-Regular' }}
                textAnchor="middle" 
                dy={10} 
                style={{ textTransform: 'uppercase' }}
            />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                    
                    verticalAlign="top"
                    layout="horizontal"
                    iconType="square"
                    iconSize={8}
                    wrapperStyle={{
                        fontFamily: 'Sk-Modernist-Regular',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        fontWeight: '300',
                        marginTop: '-25px' 
                    }}
                />
              <Area 
                  type="monotone" 
                  dataKey="value" 
                  name="Predicted Reading" 
                  stroke="#F1918F" 
                  fill="#F1918F" 
                  fillOpacity={0.3} 
                  strokeWidth={4}
              />
              <Area 
                  type="monotone" 
                  dataKey="allDataValue" 
                  name="Actual Reading" 
                  stroke="#6F93D3" 
                  fill="#6F93D3" 
                  fillOpacity={0.3}  
                  strokeWidth={4}
              />
            </AreaChart>
          </ResponsiveContainer>
  
          <div className='chart-navigation-buttons'>
            <button 
                className='nav-button'
                onClick={() => {
                    setPage(prevPage => Math.max(0, prevPage - 1));
                    setInitialLoad(false);
                }}
                disabled={page === 0}
            >
                Previous
            </button>

            <button 
                className='nav-button'
                onClick={() => {
                    setPage(prevPage => prevPage + 1);
                    setInitialLoad(false);
                }}
                disabled={integratedDataState.length - 1 <= 5 * (page + 1)}
            >
                Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TurbidityPA;
