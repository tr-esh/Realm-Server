import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    AreaChart,
    XAxis,
    YAxis,
    Tooltip,
    LabelList,
    Area,
    ResponsiveContainer,
  } from 'recharts';
  import '../../styles/Analysis.css'

const TurbidityPrediction = () => {
    const [predictions, setPredictions] = useState([]);
    const [error, setError] = useState(null); 

    // useEffect(() => {
    //   // Fetch data immediately on mount
    //   fetchData();

    //   // Then fetch data every minute
    //   const intervalId = setInterval(fetchData, 60 * 1000);

    //   // Clear interval on unmount
    //   return () => clearInterval(intervalId);
    // }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/realm/predictions/turbidity');
                const jsonData = await response.json();
    
                if (jsonData.length > 0) {
                    const now = new Date();
                    const currentHour = now.getHours();
    
                    const desiredHours = Array.from({ length: 12 }, (_, i) => (currentHour + (i * 2)) % 24);

                    const formattedData = desiredHours.map(desiredHour => {
                        const matchedData = jsonData.find(item => {
                            const itemDate = new Date(item.values.timestamp);
                            return itemDate.getHours() === desiredHour;
                        });
    
                        if (matchedData) {
                            return {
                                value: matchedData.values.value,
                                timestamp: new Date(`${now.toISOString()
                                                          .slice(0, 11)}${String(desiredHour)
                                                          .padStart(2, '0')}:00:00Z`)
                            };
                        } else {
                            return {
                                value: null,
                                timestamp: new Date(`${now.toISOString()
                                                          .slice(0, 11)}${String(desiredHour)
                                                          .padStart(2, '0')}:00:00Z`)
                            };
                        }
                    });
    
                    setPredictions(formattedData);
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
    

    const processPredictedData = useCallback(() => {
        return predictions.map((entry) => {
            const date = new Date(entry.timestamp);
    
            if (isNaN(date.getTime())) {
                console.warn('Invalid date:', entry.timestamp);
                return null;
            }
    
            const hour = date.getUTCHours();
            const period = hour < 12 ? 'AM' : 'PM';  
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    
            return {
                hour: `${displayHour} ${period}`,
                predictedTurbidity: entry.value ? parseFloat(entry.value.toFixed(2)) : null
            };
        }).filter(Boolean);
    }, [predictions]);

        const processedData = useMemo(() => {
            return processPredictedData();
        }, [processPredictedData]);


    const CustomXAxisTick = ({ x, y, payload }) => {
        const hour = payload.value;
        const handleButtonClick = () => {
            console.log('Button clicked:', hour);
        };
      

      return (
            <g transform={`translate(${x},${y})`}>
                <foreignObject width={80} height={40} x={-40}>
                    <button
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'transparent',
                            color: 'white',
                            fontWeight: '200',
                            fontSize: '0.7rem',
                            border: 'none',
                            textTransform: 'uppercase',
                            fontFamily: 'Sk-Modernist-Regular'
                        }}
                        onClick={handleButtonClick}
                    >
                        {hour}
                    </button>
                </foreignObject>
            </g>
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" 
                     style={{ backgroundColor: '#0d2135', 
                              width: '15rem', 
                              border: 'none'}}>
                    <p className="label" >{`Predicted Reading: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    }; 

    return (
        <div style={{ width: '100%', 
                      height: '70%', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center' }}>
            <ResponsiveContainer>
                <AreaChart data={processedData}>
                    <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        height={50}
                        interval={0}
                        tick={<CustomXAxisTick />}
                        padding={{ left: 30, right: 30 }}
                    />
                    <YAxis axisLine={false}
                        tick={false}
                        width={0}
                    />
                    <Tooltip content={<CustomTooltip />}/>
                    <Area
                        type="monotone"
                        dataKey="predictedTurbidity"
                        name="Predicted Reading"
                        stroke="#8cacff"
                        fill="#8cacff"
                        fillOpacity={0.3}
                        strokeWidth={4}
                        >
                        <LabelList dataKey="predictedTurbidity" 
                                   position="top"
                                   style={{ fontFamily: 'Sk-Modernist-Regular', fontSize: '0.7rem'}} />
                    </Area>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TurbidityPrediction