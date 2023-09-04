import React from 'react';
import SummaryChart from './SummaryChart';



const Summary = () => {
    
      
    return (
        <div >
            <div style={{fontFamily: 'Poppins', fontSize: '1.2rem'}}> MONTHLY <span style={{color: '#66B2FF'}} > DISTRIBUTION </span> </div> 
            <div style={{ height: '15rem'}}> 
            <SummaryChart />
            </div>
            
           
        </div>
    );
}

export default Summary;
