import React, { useState, useEffect } from 'react'
import './styles/Clock.css'

const useClock = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const intervalId = setInterval(() => {
          setTime(new Date());
        }, 1000);
    
        return () => {
          clearInterval(intervalId);
        };
      }, []);
    
      return time;
    };
    
const DashClock = () => {
    const time = useClock();
    const secondHandDegrees = (time.getSeconds() / 60) * 360 + 90;
    const minuteHandDegrees = (time.getMinutes() / 60) * 360 + 90;
    const hourHandDegrees = (time.getHours() / 12) * 360 + 90;

  return (
    <div className="clock">
      <div className="clock-face">
        <div className="hand hour-hand" style={{ transform: `rotate(${hourHandDegrees}deg)` }} />
        <div className="hand minute-hand" style={{ transform: `rotate(${minuteHandDegrees}deg)` }} />
        <div className="hand second-hand" style={{ transform: `rotate(${secondHandDegrees}deg)` }} />
      </div>
    </div>
  )
}

export default DashClock
