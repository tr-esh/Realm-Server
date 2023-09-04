import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Text} from 'recharts';

const fetchData = async () => {
    const response = await fetch('/api/realm/alldata'); // Update with your API endpoint
    const data = await response.json();
    return data;
}

const getMonthlyData = (data) => {
    const monthlyData = {};
    data.forEach(item => {
        const date = new Date(item.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });
        if (!monthlyData[month]) {
            monthlyData[month] = { month, TEMPERATURE: 0, TURBIDITY: 0, PH: 0 };
        }
        monthlyData[month][item.type] += 1;
    });
    return Object.values(monthlyData);
}

const SummaryChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchDataAndUpdateState = async () => {
            const data = await fetchData();
            const monthlyData = getMonthlyData(data);
            setData(monthlyData);
        }
        fetchDataAndUpdateState();
    }, []);
 

    const CustomizedAxisTick = ({ x, y, payload }) => {
        return (
          <Text x={x} y={y} textAnchor="middle" verticalAnchor="start" fontFamily="Poppins" fontWeight= '400' fill = '#ffff' fontSize = '0.7rem'>
            {payload.value.toUpperCase()}
          </Text>
        );
      };
      
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            
            <ResponsiveContainer>
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 8,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                
                <Legend
                    align="center"
                    verticalAlign="bottom"
                    layout="horizontal"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                        fontFamily: 'Poppins',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        fontWeight: '300',
                        marginTop: '-10px' // Add inline margin to adjust spacing for the legends
                    }}
                />
                <XAxis dataKey="month" tick={<CustomizedAxisTick />} tickLine={false}/>
                <YAxis 
                    tick={{ fontSize: 10, fontFamily: 'Poppins', fill: '#ffff', fontWeight: '400' }} // Change font color here
                    axisLine={false} // Remove the level line
                    tickLine={false}
                    width={10}
                />
                
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: 'rgba(13, 33, 53, 0.32)', // Set the menu background color
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    color: 'white',
                    fontSize: '1rem',
                    fontFamily: 'Poppins',
                    borderRadius: '0.5rem', border: 'none'}} // Customize tooltip color
                />
                <Bar
                    dataKey="TEMPERATURE"
                    fill="#4E79B4"
                    radius={[7, 7, 0, 0]}
                
                />
                <Bar
                    dataKey="TURBIDITY"
                    fill="#6F93D3"
                    radius={[7, 7, 0, 0]}
                   
                />
                <Bar
                    dataKey="PH"
                    fill="#9FB9DD"
                    radius={[7, 7, 0, 0]}
                />

            </BarChart>
           
        </ResponsiveContainer>
       
        </div>
    );
}

export default SummaryChart;
