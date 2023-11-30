import React, { useEffect, useState } from 'react';
import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Text
} from 'recharts';
import '../../styles/MonthParamStyle.css'

const ParameterStacked = () => {
  const [data, setData] = useState([]);
  const [totalOutliers, setTotalOutliers] = useState(0);
  const [normalCount, setNormalCount] = useState(0); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/realm/monthdata');
        const responseData = await response.json();
  
        // Determine the month with the most data
        const monthCounts = {};
        responseData.forEach((entry) => {
          const createdAt = new Date(entry.createdAt);
          const month = createdAt.toLocaleString('en-US', { month: 'long' });
          monthCounts[month] = (monthCounts[month] || 0) + 1;
        });
  
        const mostDataMonth = Object.keys(monthCounts).reduce((a, b) =>
          monthCounts[a] > monthCounts[b] ? a : b
        );
  
        // Filter data to get the month with the most entries
        const selectedMonthData = responseData.filter((entry) => {
          const createdAt = new Date(entry.createdAt);
          const month = createdAt.toLocaleString('en-US', { month: 'long' });
          return month === mostDataMonth;
        });
  
        // Determine counts for each parameter
        const temperatureData = selectedMonthData.filter(entry => 
                                     entry.type === 'temperature');
        const pHData = selectedMonthData.filter(entry => 
                                     entry.type === 'pH');
        const turbidityData = selectedMonthData.filter(entry => 
                                     entry.type === 'turbidity');
  
        const tempCounts = calculatePercentage(temperatureData, 10, 22);
        const turbidCounts = calculatePercentage(turbidityData, 0.1, 5);
        const phCounts = calculatePercentage(pHData, 6.8, 8.5);

        const totalOutliersCount =
        tempCounts.outliers + turbidCounts.outliers + phCounts.outliers;
        setTotalOutliers(totalOutliersCount); // Update the state

        // Calculate the total normal count
        const totalNormal = tempCounts.normal + turbidCounts.normal + phCounts.normal;

        // Step 3: Set the normal count in state
        setNormalCount(totalNormal);
  
        setData([
          { name: 'Temperature', 
            Outliers: tempCounts.outliers, 
            'Normal Data': tempCounts.normal 
          },
          { name: 'Turbidity', 
            Outliers: turbidCounts.outliers, 
            'Normal Data': turbidCounts.normal 
          },
          { name: 'pH', 
            Outliers: phCounts.outliers, 
            'Normal Data': phCounts.normal 
          },
        ]);
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);  

  const calculatePercentage = (parameterData, minValue, maxValue) => {
    const total = parameterData.length;
    const outliers = parameterData.filter(
      (entry) =>
        entry.value[0] < minValue ||
        entry.value[1] < minValue ||
        entry.value[2] < minValue ||
        entry.value[0] > maxValue ||
        entry.value[1] > maxValue ||
        entry.value[2] > maxValue
    ).length;
    const normal = total - outliers;
    return {
      outliers: outliers,
      normal: normal  
    };
  };

  const CustomizedAxisTick = ({ x, y, payload }) => {
    return (
      <Text x={x} y={y} 
            textAnchor="middle" 
            verticalAnchor="start" 
            fontFamily="Sk-Modernist-Regular" 
            fontWeight= '400' 
            fontSize= '0.7rem' 
            fill= '#ffff'>
        {payload.value.toUpperCase()}
      </Text>
    );
  };

  const CustomBarShape = (props) => {
    const {
      fill,
      x, 
      y, 
      width, 
      height,
      isTop 
    } = props;
  
    const radius = 5;
  
    const path = isTop ? 
      `M${x},${y + height} L ${x + width},
       ${y + height} L ${x + width},
       ${y + radius} Q ${x + width},
       ${y} ${x + width - radius},
       ${y} L ${x + radius},
       ${y} Q ${x},${y} ${x},
       ${y + radius} L ${x},
       ${y + height}`
    :
      `M${x},${y + height} L ${x + width},
       ${y + height} L ${x + width},
       ${y} L ${x},
       ${y} L ${x},
       ${y + height}`;
  
    return <path d={path} fill={fill} />;
  };
  
  
  

  return (
    <div className="chart-container" 
         style={{ display: 'flex', 
                  justifyContent: 'center', 
                  height: '100%', 
                  width: '100%' }}>
      <div className="chart-wrapper" 
           style={{ width: '95%' }}>
        <div style={{ paddingTop: '-40rem', 
                      fontFamily: 'Sk-Modernist-Regular', 
                      fontSize: '0.7rem', 
                      fontWeight: '500', 
                      textTransform:'uppercase', 
                      textAlign: 'right' }}>
          Data Class Breakdown
        </div>
        <div className='outlier-counts' 
            style={{ fontSize: '2rem', 
                     fontWeight: '700', 
                     fontFamily: 'Sk-Modernist-Regular', 
                     textAlign: 'right', 
                     marginTop: '-0.5rem', color: '#8cacff'}}>
          {totalOutliers}
          </div>
          <div style={{ fontFamily: 'Sk-Modernist-Regular', 
                        fontSize: '0.7rem', 
                        fontWeight: '300', 
                        textTransform: 'uppercase', 
                        textAlign: 'right', 
                        marginTop: '-0.5rem'}}> 
          OUTLIERS
          </div>

          <div className='outlier-counts' 
               style={{ fontSize: '2rem', 
                        fontWeight: '700', 
                        fontFamily: 'Sk-Modernist-Regular', 
                        textAlign: 'right', 
                        marginTop: '0.2rem', color: '#8cacff'}}>
          {normalCount}
          </div>
          <div style={{ fontFamily: 'Sk-Modernist-Regular', 
                        fontSize: '0.7rem', 
                        fontWeight: '300', 
                        textTransform: 'uppercase', 
                        textAlign: 'right', 
                        marginTop: '-0.5rem'}}> 
          NORMAL DATA
          </div>
        <ResponsiveContainer className="stack-responsive-container">
          <BarChart
            data={data}
            margin={{ top: 20, right: 1, left: 20, bottom: 5 }}
            barSize={30}
            barCategoryGap={0}
          >
            <XAxis dataKey="name" 
                   tick={<CustomizedAxisTick />} 
                   tickLine={false} 
                   width={10}/>
            <YAxis 
                    tick={{ fontSize: 10, 
                            fontFamily: 'Sk-Modernist-Regular', 
                            fill: '#ffff', 
                            fontWeight: '400'}}
                    axisLine={false} 
                    tickLine={false}
                    width={10}
                />
            <Tooltip />
            <Legend
              align="right"
              verticalAlign="middle"
              layout="vertical"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                  fontFamily: 'Sk-Modernist-Regular',
                  textTransform: 'uppercase',
                  fontSize: '0.7rem',
                  fontWeight: '300',
                  marginTop: '1.5rem', 
                 
              }}
            />

            <Bar 
              dataKey="Outliers" 
              stackId="a" 
              fill="#8cacff"
              shape={(props) => {
                const { y, height, index } = props;
                const isTop = data[index]['Normal Data'] === 0; 
                return <CustomBarShape {...props} isTop={isTop} />;
              }}
            />
            <Bar 
              dataKey="Normal Data" 
              stackId="a" 
              fill="#9FB9DD" 
              shape={(props) => {
                const { y, height, index } = props;
                const isTop = data[index]['Outliers'] === 0 || data[index]['Normal Data'] > 0; 
                return <CustomBarShape {...props} isTop={isTop} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
       
      </div>
    </div>
  );
};

export default ParameterStacked;
