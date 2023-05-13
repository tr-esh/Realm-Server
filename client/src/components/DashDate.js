import React, { useState, useEffect } from 'react'
import moment from 'moment'

function DashDate() {
    const [date, setDate] = useState(moment().format('DD MMM YYYY'));

    useEffect(() => {
      const updateDate = () => {
          setDate(moment().format('DD MMM YYYY'));
          setTimeout(updateDate, 1000);
        }
        updateDate();

  }, [date]);

  return (
    <div>{date}</div>
  )
}

export default DashDate