import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom"
import { Button, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TemperatureChart from './LineGraphs/TemperatureChart';
import TurbidityChart from './LineGraphs/TurbidityChart';
import PhLevelChart from './LineGraphs/PhLevelChart';
import Summary from './SummaryGraphs/Summary';
import MonthlyParameter from './Details/MonthlyParameter';
import TemperaturePrediction from './Predictive/TemperaturePrediction';
import TurbidityPrediction from './Predictive/TurbidityPrediction';
import PhPrediction from './Predictive/PhPrediction';
import TemperatureNext from './Predictive/TemperatureNext'
import TurbidityNext from './Predictive/TurbidityNext'
import PhNext from './Predictive/PhNext'
import '../styles/Analytics.css'


const options = [
  { label: 'TEMPERATURE', color: '#09111c' },
  { label: 'TURBIDITY',   color: '#09111c' },
  { label: 'PH',          color: '#09111c' },
]; 


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : '#0A1929',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: '2.5rem',
  fontWeight: '600',
  fontSize: '1rem',
  color: '#ffff',
  boxShadow: 'none',
})
);




const AnalyticMain = () => {

  const [highRecord, setHighRecord] = useState({ parameter: null, value: null, date: null });
  const [lowRecord, setLowRecord] = useState({ parameter: null, value: null, date: null });
  const [showSummary, setShowSummary] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentChart, setCurrentChart] = useState('TEMPERATURE');
  const { parameter } = useParams();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleMenuItemClick = (option) => {
    navigate(`/Analytics/${option.label.toLowerCase()}`);
    handleClose();
  };

  const getColorForChart = (chart) => {
    const option = options.find((o) => o.label === chart);
    return option ? option.color : "#FFFFFF"; // default to white if not found
  };


  useEffect(() => {
    const fetchParameterData = async () => {
      try {
        const response = await fetch('/api/realm/alldata');
        const data = await response.json();
  
        const filteredData = data.filter(item => item.type === currentChart);
        
        let parameterData = [];
        switch (currentChart) {
          case 'TEMPERATURE':
            parameterData = filteredData.map(item => item.temperature_value);
            break;
          case 'TURBIDITY':
            parameterData = filteredData.map(item => item.ntu_value);
            break;
          case 'PH':
            parameterData = filteredData.map(item => item.ph_value);
            break;
          default:
            break;
        }
  
        let recordHigh = parameterData[0];
        let recordLow = parameterData[0];
  
        parameterData.forEach((value, index) => {
          if (value !== null) {
            if (value > recordHigh) {
              recordHigh = value;
            }
            if (value < recordLow) {
              recordLow = value;
            }
          }
        });

        const matchedOption = options.find(option => option.label === currentChart);
        const imgStyle = matchedOption ? { backgroundColor: matchedOption.color } : {};

        setHighRecord({
          parameter: currentChart,
          value: recordHigh,
          date: new Date(data[parameterData.indexOf(recordHigh)].createdAt)
         .toLocaleString('default', { month: 'long', year: 'numeric' }),
          imgStyle: imgStyle
        });
  
        setLowRecord({
          parameter: currentChart,
          value: recordLow,
          date: new Date(data[parameterData.indexOf(recordLow)].createdAt)
          .toLocaleString('default', { month: 'long', year: 'numeric' }),
          imgStyle: imgStyle
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchParameterData();
    
  }, [currentChart]);


  useEffect(() => {
    if (parameter && typeof parameter === 'string') {
        setCurrentChart(parameter.toUpperCase());
    }
 }, [parameter]);
 

  const upIcon = new URL('../../img/rise.png', import.meta.url)
  const downIcon = new URL('../../img/decrease.png', import.meta.url)



  return (
    <div style={{ margin: '4rem 8rem'}} 
         className='analytic-main'>
      
      <Grid container spacing={2}>
        <Grid xs={6} md={8}>
          <Item 
            style={{ height: '22rem', 
            backgroundColor: '#0A1929', 
            marginTop: '1.5rem' }}>
          
          <div className='header-holder' 
               style={{ display: 'flex', 
               paddingTop: '1.5rem', 
               paddingLeft:'2rem', 
               justifyContent: 'flex-start', 
               alignItems: 'center' }}>

          <button
              onClick={() => setShowSummary(true)}
              style={{ 
                borderBottom: showSummary ? '2px solid #4E79B4' : 'none', 
                background: 'none', 
                border: 'none', 
                marginRight: '1rem', 
                color: 'white', 
                fontFamily: 'Sk-Modernist-Regular'
              }}
            >
              SUMMARY OF FINDINGS
            </button>
            
            <button
              onClick={() => setShowSummary(false)}
              style={{ 
                borderBottom: !showSummary ? '2px solid #4E79B4' : 'none', 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                fontFamily: 'Sk-Modernist-Regular' 
              }}
            >
              MORE DETAILS
            </button>
          </div>

          <div className='MainGraph' 
               style={{ padding: '2rem', 
               height: '16rem'}}>
          {showSummary ? <Summary /> : <MonthlyParameter />}
        </div>
      </Item>
    </Grid>

        <Grid xs={6} md={4}>
          <Item 
          style={{  height: '22rem', 
                    backgroundColor: '#8cacff', 
                    marginTop: '1.5rem', 
                    marginLeft: '1rem'}}>
          
            <div className='Record-head' 
                 style={{ display: 'flex', 
                          flexDirection: 'row', 
                          paddingTop: '1.5rem' }}>
            
            <p style={{fontSize: '1rem', 
                       textAlign: 'left',  
                       paddingTop: '0.5rem', 
                       paddingLeft:'2rem', 
                       paddingRight: '4.5rem', 
                       paddingBottom: '0.5rem', 
                       fontFamily: 'Sk-Modernist-Regular', color:'#09111c'}}> 
                       
                       RECORD OVERVIEW </p> 

              <Button aria-controls="simple-menu" 
                      aria-haspopup="true" 
                      onClick={handleClick}
                      endIcon={<ArrowDropDownIcon />} 
                      sx={{
                        backgroundColor: getColorForChart(currentChart),
                        '&:hover': { 
                          backgroundColor: getColorForChart(currentChart),
                          opacity: 0.8
                        },
                        borderRadius: 5,
                        color: 'white',
                        width: 130, 
                        height: 40, 
                        fontSize: '0.7rem'
                      }}
              >
                {currentChart}
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  '.MuiPaper-root': {
                    backgroundColor: 'rgba(13, 33, 53, 0.32)', 
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    color: 'white',
                    fontSize: '0.5rem',
                    fontFamily: 'Sk-Modernist-Regular',
                  },
                  '.MuiMenuItem-root': {
                    fontSize: '0.8rem', 
                    fontFamily: 'Sk-Modernist-Regular'
                  }
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option.label} 
                            onClick={() => handleMenuItemClick(option)}>
                            {option.label}
                  </MenuItem>
                ))}
              </Menu>

            </div>
            <div className='data-record' 
                 style={{textAlign: 'left', 
                         padding: '1rem 2rem', 
                         display: 'flex', 
                         flexDirection: 'column'}}
              >
              <div className='line-graph' 
                   style={{ height: '7rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' }}> 
                  {currentChart === 'TEMPERATURE'
                    ? <TemperatureChart />
                    : currentChart === 'TURBIDITY'
                      ? <TurbidityChart  />
                      : <PhLevelChart />
                  }
              </div>
              
              <div className='bottom-record' 
                   style={{ color: 'white', margin: 'auto' }}>
                
                {highRecord.value !== null && lowRecord.value !== null && (
                  <div>
                    <div className='high-record' 
                         style={{ display: 'flex', flexDirection: 'row' }}>
                      <div 
                         style={{ backgroundColor: '#09111c', 
                                  width: '3.5rem', 
                                  height: '3.5rem', 
                                  borderRadius: '1rem', 
                                  display: 'flex', 
                                  alignItems:'center', 
                                  justifyContent:'center', 
                                  marginTop: '3.5px'}}>
                           <img style={{ width: '2rem' }} 
                                src={upIcon} alt='up'>
                          </img>
                   </div>
                      
                      <div 
                         style={{ display: 'flex', 
                         flexDirection: 'column', 
                         lineHeight: 0.9, 
                         margin: '0.4rem 1rem' }}>
                        <span style={{ fontFamily: 'Sk-Modernist-Regular', 
                              fontSize: '0.7rem', 
                              fontWeight: '400', 
                              textTransform: 'uppercase', 
                              paddingBottom: '0.1rem' , color: '#09111c'}}> {highRecord.date}</span>
                        <span style={{ fontSize: '2.3rem', 
                                       fontFamily: 'Sk-Modernist-Regular', color: '#09111c' }}> 
                                      {highRecord.value} {currentChart === 
                                      'TEMPERATURE' ? '°C' : (currentChart === 
                                      'TURBIDITY' ? 'NTU' : 'PH')}
                        </span>
                        <span style={{ fontFamily: 'Sk-Modernist-Regular',
                                       fontSize: '0.5rem', 
                                       fontWeight: '400', 
                                       textTransform: 'uppercase', color: '#09111c', paddingTop: '0.1rem'}}> Recorded High 
                        </span>
                      </div>
                    </div>

                    <div className='low-record' 
                         style={{ display: 'flex', 
                                  flexDirection: 'row', 
                                  marginTop: '0.5rem' }}>
                      <div 
                         style={{ backgroundColor: '#09111c', 
                                  width: '3.5rem', 
                                  height: '3.5rem', 
                                  borderRadius: '1rem', 
                                  display: 'flex', 
                                  alignItems:'center', 
                                  justifyContent:'center', 
                                  margin: 'auto'}}>
                             <img style={{ width: '2rem' }} src={downIcon} alt='down'>
                         </img>
                      </div>
                      <div 
                          style={{ display: 'flex', 
                                   flexDirection: 'column', 
                                   lineHeight: 0.9, 
                                   margin: '0.4rem 1rem' }}>
                        <span 
                            style={{ fontFamily: 'Sk-Modernist-Regular', 
                                     fontSize: '0.7rem', 
                                     fontWeight: '400', 
                                     textTransform: 'uppercase', 
                                     paddingBottom: '0.1rem', color: '#09111c'}}> 
                                     {lowRecord.date} 
                        </span>
                        <span 
                            style={{ fontSize: '2.3rem', 
                                     fontFamily: 'Sk-Modernist-Regular' , color: '#09111c'}}>  
                                     {lowRecord.value} {currentChart === 
                                     'TEMPERATURE' ? '°C' : (currentChart === 
                                     'TURBIDITY' ? 'NTU' : 'PH')}
                        </span>
                        <span 
                            style={{ fontFamily: 'Inter', 
                                     fontSize: '0.5rem', 
                                     fontWeight: '400', 
                                     textTransform: 'uppercase', 
                                     color:'#09111c', paddingTop: '0.1rem'}}> Recorded Low 
                        </span>
                      </div>
                    </div>
                </div> 
                )}
              </div>


            </div>

          </Item>
        </Grid>

        <Grid xs={6} md={12}>
          <Item style={{  height: '19rem', 
                background: 'linear-gradient(0deg, rgba(15,38,60,0) 0%, rgba(16,39,61,1) 100%)', 
                marginTop: '1rem'}}>
          <div className='header-holder' 
               style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>

              <div className='chart-toggle-buttons' 
                   style={{ display: 'flex', width: '100%' }}>
                {options.map(option => (
                  <button
                    key={option.label}
                    onClick={() => setCurrentChart(option.label)}
                    style={{
                      flex: 1,  
                      background: 'transparent',
                      color: 'white',
                      paddingTop: '3px',
                      paddingBottom: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontFamily: 'Sk-Modernist-Regular',
                      fontWeight: '200',
                      borderBottom: currentChart === 
                        option.label ? '2px solid #8cacff' : 'none',
                      textAlign: 'center',  
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
          </div>


            <div className='predictive-chart' 
                 style={{ height: '50%', margin: 'auto' }}>
            <div style={{ fontSize: '1.5rem', 
                          fontFamily: 'Sk-Modernist-Regular', 
                          fontWeight: '600', 
                          marginBottom: '0.5rem' }}>
                          WATER QUALITY 
                          
                          <span style={{color: '#8cacff'}}> FORECAST 
                          </span>
            </div>
              <div className='chart-swipe'
                   style={{ height: '17rem', width: '100%', margin: 'auto' }}>
                {currentChart === 
                'TEMPERATURE' && <TemperaturePrediction />}
                {currentChart === 
                'TURBIDITY' && <TurbidityPrediction />}
                {currentChart === 
                'PH' && <PhPrediction />}
              </div>
            </div>
          </Item>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={6} md={12}>
            <Item style={{ height: '5rem', 
              backgroundColor: '#0d2135', borderRadius: '0.5rem',
              marginLeft: '1rem' 
              }}>
         
            <p style={{   fontSize: '1.5rem', 
                          textAlign: 'left',  
                          paddingTop: '0.5rem', 
                          paddingLeft:'2rem', 
                          paddingRight: '4.5rem', 
                          paddingBottom: '0.5rem', 
                          fontFamily: 'Sk-Modernist-Regular'}}> 
                          
                          WEEKLY FORECAST 
            </p>
              <div>
              {currentChart === 
              'TEMPERATURE' && <TemperatureNext />}
              {currentChart === 
              'TURBIDITY' && <TurbidityNext />}
              {currentChart === 
              'PH' && <PhNext />}
            </div>
          </Item>
        </Grid>
       </Grid>
      </Grid>
    </div>
  )
}
export default AnalyticMain