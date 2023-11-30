import React from 'react'
import TimeGreetings from './TimeGreetings'

function Welcome() {
  return (
    <div style={{ display: 'flex', 
                  flexDirection: 'column',
                  fontFamily: 'Sk-Modernist-Regular',
                  textTransform: 'uppercase',
                 }}>

      <div className="welcome-left" 
            style={{ display: 'flex',  
                     flexDirection: 'row',
                     lineHeight: 1.3
                    }}>

        <span style={{fontSize: '2rem',
                      paddingRight: '0.8rem'
                      }}>
              Good 
        </span>

        <span style={{color: '#8cacff', 
                      fontSize: '2rem'
                      }}>
              <TimeGreetings />
        </span>
        
      </div>
      <div style={{fontSize: '2rem', 
                   marginTop: '-0.6rem'
                  }}>
          Admin
      </div>     
    </div>
  )
}

export default Welcome