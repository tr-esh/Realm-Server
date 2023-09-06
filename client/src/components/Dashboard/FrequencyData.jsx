import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, Text } from 'recharts';
import '../styles/Dashboard.css';



const FrequencyData = () => {

    const [frequencyData, setFrequencyData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch('/api/realm/bardata')
          const json = await response.json()
    
          if (response.ok) {
            setFrequencyData(json);
          }
        }
    
        fetchData()
    
      }, [])

      const summedData = frequencyData.map(data => ({
        day: data.day,
        sum: data.temperature + data.turbidity + data.pH,
      }));

      const graphIllustration = new URL('../../img/graph_illustration.png', import.meta.url)

      
    const CustomizedAxisTick = ({ x, y, payload }) => {
        return (
          <Text x={x} y={y} textAnchor="middle" verticalAnchor="start" fontFamily="Poppins" fontWeight= '400' fill = '#ffff' fontSize = '0.7rem'>
            {payload.value.toUpperCase()}
          </Text>
        );
      };
    

      const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
          const sumValue = payload[0].payload.sum; // Get the sum value from payload
          return (
            <div className="custom-tooltip">
              <p className='tooltip-value'>{sumValue}</p>
            </div>
          );
        }
    
        return null;
      };
      

  return (
    <div className='frequency-chart' style={{width: '35rem'}}>
        {frequencyData ? (
                      <ResponsiveContainer width="100%" height={210}>
                        <AreaChart data={summedData}>
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            interval={0} // Display all labels
                            padding={{ left: 10, right: 10 }}
                            tick={<CustomizedAxisTick />}
                            />

                         
                        <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="sum"
                            stackId="1"
                            stroke="#4E79B4"
                            fill="#4E79B4"
                            fillOpacity={0.3}
                            dot={{ r: 3 }}
                            
                            gap={0} // Adjust this value to reduce the gap between areas
                            barSize={5} // Adjust the barSize to make areas closer together


                          />
                          
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <img style={{ width: '20rem', display: 'block', margin: 'auto' }} src={graphIllustration} alt="No data available" />
                    )}
                    
    </div>
  )
}

export default FrequencyData