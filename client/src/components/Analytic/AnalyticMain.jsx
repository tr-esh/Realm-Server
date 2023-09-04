import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"
import { Button, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TemperatureChart from './LineGraphs/TemperatureChart';
import TurbidityChart from './LineGraphs/TurbidityChart';
import PhLevelChart from './LineGraphs/PhLevelChart';
import Summary from './SummaryGraphs/Summary';
// import ParametersPie from './Details/DetailSection';
import MonthlyParameter from './Details/MonthlyParameter';
import TemperaturePrediction from './Predictive/TemperaturePrediction';
import TurbidityPrediction from './Predictive/TurbidityPrediction';
import PhPrediction from './Predictive/PhPrediction';
import TemperatureNext from './Predictive/TemperatureNext'
import TurbidityNext from './Predictive/TurbidityNext'
import PhNext from './Predictive/PhNext'


const options = [
  { label: 'TEMPERATURE', color: '#8A6DC1' },
  { label: 'TURBIDITY',   color: '#F1918F' },
  { label: 'PH',          color: '#F5D087' },
]; 


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1e88e5' : '#10273d',
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
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [showSummary, setShowSummary] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentChart, setCurrentChart] = useState('TEMPERATURE');
  const { parameter } = useParams();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleMenuItemClick = (option) => {
    setSelectedOption(option);
    handleClose();
  };


  useEffect(() => {
    const fetchParameterData = async (option) => {
      try {
        const response = await fetch('/api/realm/alldata'); // Replace with your API endpoint
        const data = await response.json();
  
        // Filter data based on the selected option label
        const filteredData = data.filter(item => item.type === option.label);
  
        // Map the parameter data based on the selected option label
        let parameterData = [];
        switch (option.label) {
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
  
        setHighRecord({
          parameter: option.label,
          value: recordHigh,
          date: new Date(data[parameterData.indexOf(recordHigh)].createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }),
          imgStyle: { backgroundColor: option.color }
        });
  
        setLowRecord({
          parameter: option.label,
          value: recordLow,
          date: new Date(data[parameterData.indexOf(recordLow)].createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }),
          imgStyle: { backgroundColor: option.color }
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
      fetchParameterData(selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    if (parameter && typeof parameter === 'string') {
        setCurrentChart(parameter.toUpperCase());
    }
 }, [parameter]);
 

  const upIcon = new URL('../../img/icons8-redUp.png', import.meta.url)
  const downIcon = new URL('../../img/icons8-ydown.png', import.meta.url)

  const handleToggle = (summary) => {
    setShowSummary(summary);
  };

  const borderWidth = 3;


  return (
    <div style={{ margin: '4rem 8rem'}} className='analytic-main'>
      <Grid container spacing={2}>
        <Grid xs={6} md={8}>
          <Item 
            style={{ height: '22rem', 
            backgroundColor: '#122B44', 
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
                fontFamily: 'Poppins'
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
                fontFamily: 'Poppins' 
              }}
            >
              MORE DETAILS
            </button>
          </div>

          <div className='MainGraph' style={{ padding: '2rem', height: '16rem'}}>
          {showSummary ? <Summary /> : <MonthlyParameter />}
        </div>
      </Item>
    </Grid>

        <Grid xs={6} md={4}>
          <Item 
          style={{  height: '22rem', 
                    backgroundColor: '#122B44', 
                    marginTop: '1.5rem', 
                    marginLeft: '1rem'}}>
          
            <div className='Record-head' 
                 style={{ display: 'flex', 
                          flexDirection: 'row', 
                          paddingTop: '1.5rem' }}>
            
            <p style={{fontSize: '0.8rem', 
                       textAlign: 'left',  
                       paddingTop: '0.5rem', 
                       paddingLeft:'2rem', 
                       paddingRight: '4.5rem', 
                       paddingBottom: '0.5rem', 
                       fontFamily: 'Poppins'}}> 
                       
                       RECORD OVERVIEW </p> 

              <Button aria-controls="simple-menu" 
                      aria-haspopup="true" 
                      onClick={handleClick}
                      endIcon={<ArrowDropDownIcon />} 
                      sx={{
                        backgroundColor: selectedOption.color,
                        '&:hover': { 
                          backgroundColor: selectedOption.color,
                          opacity: 0.8
                        },
                        borderRadius: 5,
                        color: 'white',
                        width: 130,  // Set width
                        height: 40,  // Set height
                        fontSize: '0.7rem'
                      }}
              >
                {selectedOption.label}
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  '.MuiPaper-root': {
                    backgroundColor: 'rgba(13, 33, 53, 0.32)', // Set the menu background color
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    color: 'white',
                    fontSize: '0.5rem',
                    fontFamily: 'Poppins',
                  },
                  '.MuiMenuItem-root': {
                    fontSize: '0.8rem',  // Set the font size
                    fontFamily: 'Poppins'
                  }
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option.label} onClick={() => handleMenuItemClick(option)}>{option.label}</MenuItem>
                ))}
              </Menu>

            </div>
            <div className='data-record' style={{textAlign: 'left', padding: '1rem 2rem', display: 'flex', flexDirection: 'column'}}>
              
           
              <div className='line-graph' style={{ height: '7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> 
                  {selectedOption.label === 'TEMPERATURE'
                    ? <TemperatureChart />
                    : selectedOption.label === 'TURBIDITY'
                      ? <TurbidityChart  />
                      : <PhLevelChart />
                  }
              </div>
              
              <div className='bottom-record' style={{ color: 'white', margin: 'auto' }}>
                {highRecord.value !== null && lowRecord.value !== null && (
                  <div>
                    <div className='high-record' style={{ display: 'flex', flexDirection: 'row' }}>
                      <div style={{ backgroundColor: '#453245', width: '3rem', height: '3rem', borderRadius: '1rem', display: 'flex', alignItems:'center', justifyContent:'center', marginTop: '3.5px'}}>
                        <img style={{ width: '2rem' }} src={upIcon} alt='up'></img>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9, margin: '0.4rem 1rem' }}>
                        <span style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: '400', textTransform: 'uppercase', paddingBottom: '0.3rem' }}> {highRecord.date}</span>
                        <span style={{ fontSize: '1.5rem', fontFamily: 'Poppins' }}> {highRecord.value} {selectedOption.label === 'TEMPERATURE' ? '°C' : (selectedOption.label === 'TURBIDITY' ? 'NTU' : 'PH')}</span>
                        <span style={{ fontFamily: 'Poppins', fontSize: '0.5rem', fontWeight: '400', textTransform: 'uppercase' }}> Recorded High </span>
                      </div>
                    </div>

                    <div className='low-record' style={{ display: 'flex', flexDirection: 'row', marginTop: '0.5rem' }}>
                      <div style={{ backgroundColor: '#595E4D', width: '3rem', height: '3rem', borderRadius: '1rem', display: 'flex', alignItems:'center', justifyContent:'center', margin: 'auto'}}>
                        <img style={{ width: '2rem' }} src={downIcon} alt='down'></img>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9, margin: '0.4rem 1rem' }}>
                        <span style={{ fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: '400', textTransform: 'uppercase', paddingBottom: '0.3rem' }}> {lowRecord.date} </span>
                        <span style={{ fontSize: '1.5rem', fontFamily: 'Poppins' }}>  {lowRecord.value} {selectedOption.label === 'TEMPERATURE' ? '°C' : (selectedOption.label === 'TURBIDITY' ? 'NTU' : 'PH')}
                        </span>
                        <span style={{ fontFamily: 'Inter', fontSize: '0.5rem', fontWeight: '400', textTransform: 'uppercase' }}> Recorded Low </span>
                      </div>
                    </div>
                    </div>
                )}
              </div>


            </div>

          </Item>
        </Grid>

        <Grid xs={6} md={12}>
          <Item style={{  height: '20rem', background: 'linear-gradient(0deg, rgba(15,38,60,0) 0%, rgba(16,39,61,1) 100%)', marginTop: '1rem'}}>
          <div className='header-holder' style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>

              {/* Buttons to choose which chart to display */}
              <div className='chart-toggle-buttons'style={{ paddingLeft:'1rem' }}>
                {options.map(option => (
                  <button
                    key={option.label}
                    onClick={() => setCurrentChart(option.label)}
                    style={{
                      background: 'transparent',
                      color: 'white',
                      paddingTop: '3px',
                      marginRight: '50px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontFamily: 'Poppins',
                      fontWeight: '200',
                      borderBottom: currentChart === option.label ? `2px solid ${option.color}` : 'none'  // Set borderBottom using option.color
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
          </div>


            <div className='predictive-chart' style={{ height: '50%', margin: 'auto' }}>
            <div style={{ fontSize: '1.3rem', fontFamily: 'Poppins', fontWeight: '600', marginBottom: '0.5rem' }}>
                WATER QUALITY <span style={{color: '#66B2FF'}}> FORECAST </span>
              </div>
              <div className='chart-swipe'style={{ height: '18rem', width: '100%', margin: 'auto' }}>
                {currentChart === 'TEMPERATURE' && <TemperaturePrediction />}
                {currentChart === 'TURBIDITY' && <TurbidityPrediction />}
                {currentChart === 'PH' && <PhPrediction />}
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
         
         <p style={{fontSize: '0.8rem', 
                       textAlign: 'left',  
                       paddingTop: '0.5rem', 
                       paddingLeft:'2rem', 
                       paddingRight: '4.5rem', 
                       paddingBottom: '0.5rem', 
                       fontFamily: 'Poppins'}}> 
                       
                       WEEKLY FORECAST </p> 

                       <div>
              {/* Render content based on selected option */}
              {currentChart === 'TEMPERATURE' && <TemperatureNext />}
              {currentChart === 'TURBIDITY' && <TurbidityNext />}
              {currentChart === 'PH' && <PhNext />}
            </div>
          </Item>
        </Grid>
        </Grid>

      </Grid>
    </div>
  )
}

export default AnalyticMain