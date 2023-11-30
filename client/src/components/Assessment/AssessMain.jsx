import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';  
import { Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import TemperaturePA from './PredictedActual/TemperaturePA';
import TurbidityPA from './PredictedActual/TurbidityPA';
import PhDataPA from './PredictedActual/PhDataPA';
import PredictedValue from './ReadingsReview/PredictedValue';
import TurbidityReview from './ReadingsReview/TurbidityReview';
import PhReview from './ReadingsReview/PhReview';
import '../styles/Review.css'

const options = [
  { label: 'TEMPERATURE', color: '#8A6DC1' },
  { label: 'TURBIDITY',   color: '#F1918F' },
  { label: 'PH',          color: '#F5D087' },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode ===  'dark' ? '#1e88e5' : '#10273d',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: '2.6rem',
  fontWeight: '600',
  fontSize: '1rem',
  fontFamily: 'Sk-Modernist-Regular',
  color: '#7da4cc',
  boxShadow: 'none',
}));

const AssessMain = () => {

  const { parameter } = useParams();

  const [currentChart, setCurrentChart] = useState(parameter ? parameter.toUpperCase() : 'TEMPERATURE');

  // Conditional rendering of the chart based on the currentChart state
  const renderChart = () => {
    switch(currentChart) {
      case 'TEMPERATURE':
        return <TemperaturePA />;
      case 'TURBIDITY':
        return <TurbidityPA />;
      case 'PH':
        return <PhDataPA />;
      default:
        return null;
    }
  }

  const renderReadingsRev = () => {
    switch (currentChart) {
      case 'TEMPERATURE':
        return <PredictedValue />;
      case 'TURBIDITY':
        return <TurbidityReview />;
      case 'PH':
        return <PhReview />;
      default:
        return null;
    }
  };

  return (
    <div style={{ margin: '5rem 5rem'}} 
         className='Assessment-main'>

      <Grid container spacing={2}>
          <Grid xs={6} md={8}>
              <Item
                style={{ height: '24rem', 
                         width: '63rem',
                         backgroundColor: '#122B44', 
                         marginTop: '1.5rem' }}
                  >
                  <div className="accuracyPerf">
                    <div className="toggle-selection">
                        <div className='chart-toggle-buttons'>
                          {options.map(option => (
                            <button
                            key={option.label}
                            onClick={() => setCurrentChart(option.label)}
                            style={{
                              flex: 1,
                              background: 'transparent',
                              color: 'white',
                              paddingTop: '3px',
                              paddingBottom: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontFamily: 'Sk-Modernist-Regular',
                              fontWeight: '200',
                              borderBottom: currentChart === option.label ? 
                                              `2px solid ${option.color}` : 'none',
                              textAlign: 'center',
                            }}
                        >
                          {option.label}
                        </button>                
                        ))}
                      </div>
                    </div>

                    <div className='charts-pa' 
                         style={{ height: '18rem', 
                                  marginTop: '6rem' }}
                      >
                        <div style={{ height: '100%', 
                                      width: '100%', 
                                      margin: 'auto' }}
                            >
                            {renderChart()}
                        </div>
                    </div>
                  </div>
              </Item>
            </Grid>


            <Grid xs={6} md={8}>
              <Item
                  style={{
                    height: '19rem',
                    width: '63rem',
                    backgroundColor: '#122B44',
                    marginTop: '2rem',
                  }}
                >
                <div className="readingsRev">
                  RECENT <span style={{ color: '#7da4cc' }}> ACCURACY </span> OVERVIEW
                  <div className="readingsResult">
                    {renderReadingsRev()}
                  </div>
                </div>
              </Item>
            </Grid>
      </Grid>
    </div>
  )
}


export default AssessMain