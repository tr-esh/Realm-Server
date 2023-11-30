import React, { useEffect, useState, useCallback } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, Text, CartesianGrid} from 'recharts';
import '../styles/Dashboard.css';

const FrequencyData = () => {
  const [frequencyData, setFrequencyData] = useState([]);
  const [lastWeekData, setLastWeekData] = useState([]); 
  const [hasNewData, setHasNewData] = useState(false);
  const [weekOfMonth, setWeekOfMonth] = useState(1); 
  const [monthName, setMonthName] = useState(""); 

  const ensureStartsWithSunday = (data) => {
    const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // If data is empty or already starts with Sunday, no need for adjustments
    if (data.length === 0 || data[0].day === "Sunday") {
      return data;
    }

    const firstDayIndex = daysOrder.indexOf(data[0].day);
    const prependedDays = [];

    for (let i = 0; i < firstDayIndex; i++) {
      prependedDays.push({
        day: daysOrder[i],
        sum: 0
      });
    }

    return [...prependedDays, ...data];
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/realm/bardata');
      const json = await response.json();

      if (response.ok) {
        if (json.length > 0) {
          setHasNewData(true);
          setFrequencyData(ensureStartsWithSunday(json));
          setLastWeekData(json); // Adjust this as well if required
        } else if (!hasNewData) {
          setFrequencyData(ensureStartsWithSunday(lastWeekData));
        }
      }
    };

    fetchData();
  }, [lastWeekData, hasNewData]);

  useEffect(() => {
    // Get the current date in PH timezone
    const currentDateInPHString = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    const currentDate = new Date(currentDateInPHString);

    const currentDayOfMonth = currentDate.getDate();

    // Calculate the week of the month
    const calculatedWeekOfMonth = Math.ceil(currentDayOfMonth / 7);
    setWeekOfMonth(calculatedWeekOfMonth);

    const calculatedMonthName = currentDate.toLocaleString('en-US', { month: 'long', timeZone: "Asia/Manila" });
    setMonthName(calculatedMonthName);

  }, []);

  const summedData = frequencyData.map((data) => ({
    day: data.day,
    sum: data.temperature + data.turbidity + data.pH,
  }));

  const CustomizedAxisTick = ({ x, y, payload }) => {
    return (
      <Text
        x={x}
        y={y}
        textAnchor="middle"
        verticalAnchor="start"
        fontFamily="Poppins"
        fontWeight="400"
        fill="#ffff"
        fontSize="0.7rem"
      >
        {payload.value.toUpperCase()}
      </Text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const sumValue = payload[0].payload.sum;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-value">{sumValue}</p>
        </div>
      );
    }

    return null;
  };

  const graphIllustration = new URL('../../img/graph_illustration.png', import.meta.url);

  return (
    <div className="frequency-chart" 
         style={{ width: '35rem' }}>
      <p className='week-contain' 
         style={{ letterSpacing: '0',}}> 
         Week {weekOfMonth} | {monthName} </p> 
      {/* Display the week of the month and the month name */}
      {frequencyData.length > 0 || hasNewData ? (
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={summedData}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              interval={0}
              padding={{ left: 10, right: 10 }}
              tick={<CustomizedAxisTick />}
              />
              <CartesianGrid stroke="#212e40" strokeDasharray="3 3"/>
            <Tooltip content={<CustomTooltip />} 
              />
            <Area
              type="monotone"
              dataKey="sum"
              stackId="1"
              stroke="#4E79B4"
              fill="#4E79B4"
              strokeWidth={4}
              fillOpacity={0.3}
              gap={0}
              barSize={5}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <img
          style={{ width: '17rem', 
                   display: 'block', 
                   margin: 'auto' }}
          src={graphIllustration}
          alt="No data available"
        />
      )}
    </div>
  );
};

export default FrequencyData;
