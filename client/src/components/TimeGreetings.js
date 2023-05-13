import React, { useEffect, useState } from 'react'

const TimeGreetings = () => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const date = new Date();
        const hours = date.getHours();
        let greetingMessage;
    
        if (hours < 12) {
          greetingMessage = 'Morning,';
        } else if (hours >= 12 && hours < 17) {
          greetingMessage = 'Afternoon,';
        } else {
          greetingMessage = 'Evening,';
        }
    
        setGreeting(greetingMessage);
      }, []);

  return (
    <div>{greeting}</div>
  )
}

export default TimeGreetings