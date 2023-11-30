import React from 'react';
import SummaryChart from './SummaryChart';



const Summary = () => {
    
      
    return (
        <div >
            <div 
               style={{fontFamily: 'Sk-Modernist-Regular', 
                       fontSize: '1.5rem'}}> 
                       MONTHLY 
                       <span style={{color: '#8cacff'}} > DISTRIBUTION </span> </div> 
            <div style={{ height: '15rem'}}> 
            <SummaryChart />
            </div>
            
           
        </div>
    );
}

export default Summary;
