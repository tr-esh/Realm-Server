import React from 'react'
import TimeGreetings from './TimeGreetings'

function Welcome() {
  return (
    <div style={{ display: 'flex', 
                  flexDirection: 'column' }}>
      <div className="welcome-left" 
            style={{ display: 'flex',  
                      flexDirection: 'row',
                      lineHeight: 1}}>

        <span style={{fontSize: '2rem', paddingRight: '0.8rem'}}>
                      Good 
        </span>

        <span style={{  color: '#66B2FF', 
                        fontSize: '2rem'}}><TimeGreetings /></span>
        
      </div>
      <div style={{fontSize: '2rem'}}>Dale</div>



     
      </div>
  )
}

export default Welcome