import React, { useState, useEffect } from 'react';
import { Divider } from '@mui/material';
import '../styles/ControlsSide.css';


const ControlsSide = () => {

    const [latestData, setLatestData] = useState(null);
  
    const aggregateScore = (entry) => {
      return (entry.temperature + entry.turbidity + entry.pH) / 3;
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/realm/accuracydata');
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          
          // Set only the latest data
          if (data.length > 0) {
            setLatestData(data[0]);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);


  const rise = new URL('../../img/rise.png', import.meta.url)
  const down = new URL('../../img/decrease.png', import.meta.url)

  return (
    <div className='controls-side'>
      <div className='assess-holder'>  
      <p className='a-header'> A Deep  
        <span> Dive into </span> 
        <span className='a-header1'> Accuracy Assessment </span> 
          <span className='a-paragraph'> 
          Through the integration of sensor-based measurements 
          and TensorFlow-based Machine Learning predictions, 
          we have conducted an extensive accuracy assessment. 
          This assessment provides a robust evaluation of the precision 
          and reliability in determining the selected physicochemical
          properties of water quality during monitoring.  </span> 
        </p> 
      </div>

      <div className='a-header'>
        <span className='a-header1'>  </span> 
          <div className='box-holder'> 
              <p className='Ai-header'> 
                IMPLICATION
                </p> 
                <Divider
                      orientation="horizontal"
                      style={{ backgroundColor: '#8cacff', 
                               width: '17rem', margin: '0.9rem 1.5rem',
                               }}
                    />
            <div className='status-contain'> 
              <div className='arrow-box'> 
              <img src={latestData && aggregateScore(latestData) > 50 ? rise : down} alt='trend' className='arrow-head' />
                </div> 
               <div className='rating'>
                <div className='a-percentage'> 
                  <span className='a-rate'> 
                  {latestData && aggregateScore(latestData).toFixed(2)}<span style={{fontFamily: 'Poppins', fontWeight: '500'}}>%</span>
                  </span>
                  <span className='acc-stat'> 
                    accuracy
                  </span>
                  </div> 
                </div>    
            </div>
            <div className='stat-holder'> 
            <p className='a-statement'>
            {latestData && `Current index performance based on the latest data.`}
                  </p> 
              </div>    
            </div> 
        </div> 
    </div>
  )
}

export default ControlsSide