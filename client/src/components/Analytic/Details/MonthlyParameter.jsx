import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from 'recharts';
import ParameterStacked from './ParameterStacked';
import '../../styles/MonthParamStyle.css'

const MonthlyParameter = () => {
  const [data, setData] = useState([]);
  const [mostDataMonth, setMostDataMonth] = useState('');
  const [temperatureCount, setTemperatureCount] = useState(0);
  const [phCount, setPhCount] = useState(0);
  const [turbidityCount, setTurbidityCount] = useState(0);

  const COLORS = ['#8A6DC1', '#F5D087', '#F1918F'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/realm/monthdata'); 
        const responseData = await response.json();

        setData(responseData);

        const monthCounts = {};
        responseData.forEach((entry) => {
          const createdAt = new Date(entry.createdAt);
          const month = createdAt.toLocaleString('en-PH', { month: 'long' });
          monthCounts[month] = (monthCounts[month] || 0) + 1;
        });

        const mostDataMonth = Object.keys(monthCounts).reduce((a, b) =>
          monthCounts[a] > monthCounts[b] ? a : b
        );
        setMostDataMonth(mostDataMonth);

        const selectedMonthData = responseData.filter((entry) => {
          const createdAt = new Date(entry.createdAt);
          const month = createdAt.toLocaleString('en-US', { month: 'long' });
          return month === mostDataMonth;
        });

        const temperatureCount = selectedMonthData.filter((entry) => 
                                    entry.type === 'temperature').length;
        const phCount = selectedMonthData.filter((entry) => 
                                    entry.type === 'pH').length;
        const turbidityCount = selectedMonthData.filter((entry) => 
                                    entry.type === 'turbidity').length;

        setTemperatureCount(temperatureCount);
        setPhCount(phCount);
        setTurbidityCount(turbidityCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: 'Temperature', value: temperatureCount },
    { name: 'pH', value: phCount },
    { name: 'Turbidity', value: turbidityCount },
  ];

  const totalValue = temperatureCount + phCount + turbidityCount;
  const tooltipFormatter = (value) => {
    const percentage = ((value / totalValue) * 100).toFixed(2);
    return `${percentage}%`;
  };

  const tooltipStyle = {
    fontFamily: 'Sk-Modernist-Regular', 
    fontSize: '0.9rem',
    fontWeight: '500',
  };
  
  
  return (
    <div className="chart-container"
         style={{ display: 'flex', 
                  justifyContent: 'center', 
                  height: '100%', 
                  width: '100%' }}>

       <div className="chart-wrapper" 
            style={{ width: '350px' }}>
      <div style={{ fontFamily: 'Sk-Modernist-Regular', 
                    fontSize: '0.7rem', 
                    fontWeight: '500', 
                    textTransform: 'uppercase', 
                    textAlign: 'left' }}>
                    MONTH WITH MOST FINDINGS
      </div>
    <div className='data-count' 
         style={{ fontSize: '3rem', 
                  fontWeight: '700', 
                  fontFamily: 'Sk-Modernist-Regular', 
                  textAlign: 'left', 
                  marginTop: '-0.5rem', color: '#8cacff'}}>
                 {temperatureCount + phCount + turbidityCount}
    </div>
    
    <div className='most-month'  
         style={{ fontFamily: 'Sk-Modernist-Regular', 
                  fontSize: '0.7rem', 
                  fontWeight: '300', 
                  textTransform: 'uppercase', 
                  textAlign: 'left', 
                  marginTop: '-0.5rem'}}> 
                  {mostDataMonth}
    </div>
        
        <ResponsiveContainer 
          className="chart-responsive-container">
            <PieChart >
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={60} 
                fill="#8884d8"
                dataKey="value"
                stroke="none"
              >
             
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
              <Tooltip 
                      formatter={tooltipFormatter} 
                      contentStyle={tooltipStyle} /> 
              <Legend
                      align="left"
                      verticalAlign="middle"
                      layout="vertical"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                          fontFamily: 'Sk-Modernist-Regular',
                          textTransform: 'uppercase',
                          fontSize: '0.7rem',
                          fontWeight: '300',
                          marginTop: '-25px' 
                      }}
                  />
          </PieChart>
        </ResponsiveContainer>
      </div>
        <div className="chart-wrapper" 
            style={{ width: '400px' }}>
            <ParameterStacked />
        </div>
    </div>
  );
};

export default MonthlyParameter;
