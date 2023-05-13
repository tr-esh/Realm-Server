import React, { useState, useEffect } from 'react'
import moment from 'moment'

function DashTime() {
  const [time, setTime ] = useState(moment().format('LT'));

  useEffect(() => {
    const updateTime = () => {
        setTime(moment().format('LT'));
        setTimeout(updateTime, 1000);
      }
      updateTime();
}, [time]);

  return (
    <div>{time}</div>
  )
}

export default DashTime