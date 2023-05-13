import React, { useState, useEffect } from 'react'
import moment from 'moment'

function Time() {
    const [time, setTime ] = useState(moment().format('llll'));

    useEffect(() => {
        const updateTime = () => {
            setTime(moment().format('llll'));
            setTimeout(updateTime, 1000);
          }
          updateTime();
    }, [time]);

  return (
    <div>{time}
    </div>
  )
}

export default Time