import React, { useEffect, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import TemperatureChart from './LineGraphs/TemperatureChart';

// const load = new URL('../../img/wave.gif', import.meta.url);

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

  const [highRecord, setHighRecord] = useState({ temperature: null, date: null });
  const [lowRecord, setLowRecord] = useState({ temperature: null, date: null });


  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch('/api/realm/gettemp'); // Replace with your API endpoint
        const data = await response.json();
        
        let recordHigh = data[0];
        let recordLow = data[0];

        data.forEach(tempReading => {
          if (tempReading.temperature_value > recordHigh.temperature_value) {
            recordHigh = tempReading;
          }
          if (tempReading.temperature_value < recordLow.temperature_value) {
            recordLow = tempReading;
          }
        });

        setHighRecord({
          temperature: recordHigh.temperature_value,
          date: new Date(recordHigh.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })
        });

        setLowRecord({
          temperature: recordLow.temperature_value,
          date: new Date(recordLow.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchTemperatureData();
  }, []);

  const options = [
    { label: 'TEMPERATURE', color: '#8A6DC1' },
    { label: 'TURBIDITY',   color: '#F1918F' },
    { label: 'PH',          color: '#F5D087' },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(options[0]);

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


  const upIcon = new URL('../../img/icons8-redUp.png', import.meta.url)
  const downIcon = new URL('../../img/icons8-ydown.png', import.meta.url)



  return (
    <div style={{ margin: '5rem 8rem'}} className='analytic-main'>
      <Grid container spacing={2}>

        <Grid xs={6} md={8}>
          <Item style={{  height: '22rem', backgroundColor: '#122B44', marginTop: '1.5rem'}}>
            <div className='header-holder'>
              <p style={{fontSize:'0.8rem', textAlign: 'left', paddingLeft: '2rem', paddingTop: '2rem'}}> SUMMARY OF FINDINGS </p>
              


            </div>

          </Item>
        </Grid>

        <Grid xs={6} md={4}>
          <Item style={{  height: '22rem', backgroundColor: '#122B44', marginTop: '1.5rem', marginLeft: '1.5rem'}}>
          
            <div className='Record-head' style={{ display: 'flex', flexDirection: 'row', paddingTop: '1.5rem' }}>
              <p style={{fontSize: '0.8rem', textAlign: 'left',  paddingTop: '0.5rem', paddingLeft:'2rem', paddingRight: '4.5rem', paddingBottom: '0.5rem'}}> RECORD AND AVERAGE </p> 

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
                    fontSize: '0.5rem'
                  },
                  '.MuiMenuItem-root': {
                    fontSize: '0.8rem',  // Set the font size
                  }
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option.label} onClick={() => handleMenuItemClick(option)}>{option.label}</MenuItem>
                ))}
              </Menu>
            </div>
              
            <div className='data-record' style={{textAlign: 'left', padding: '1rem 2rem', display: 'flex', flexDirection: 'column'}}>
              
              <div className='line-graph' style={{ width: '4rem', height: '7rem'}}>
              {/* <TemperatureChart /> */}

              </div>
              
              <div className='bottom-record' style={{ color: 'white', margin: 'auto'}}>
                  <div className='high-record' style={{ display: 'flex', flexDirection: 'row'}}>
                    <div style={{backgroundColor: '#453245', width: '4rem', height: '4rem', borderRadius: '1rem', display: 'flex', alignItems:'center', justifyContent:'center'}}>
                      <img style={{width:'3rem'}}  src={upIcon} alt='up'></img>
                      </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9, margin: '0.4rem 1rem'}}>
                      <span style={{fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: '400', textTransform: 'uppercase', paddingBottom: '0.3rem'}}> {highRecord.date}</span>
                      <span style={{ fontSize: '2rem', fontFamily: 'Poppins' }}> {highRecord.temperature} °C</span>
                      <span style={{fontFamily: 'Inter', fontSize: '0.5rem', fontWeight: '400', textTransform: 'uppercase'}}> Recorded High </span>
                      
                    </div>
                  </div>

                  <div className='low-record' style={{ display: 'flex', flexDirection: 'row', marginTop: '0.5rem'}}>
                    <div style={{backgroundColor: '#595E4D', width: '4rem', height: '4rem', borderRadius: '1rem', display: 'flex', alignItems:'center', justifyContent:'center'}}> 
                    <img style={{width:'3rem'}}  src={downIcon} alt='down'></img>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.9, margin: '0.4rem 1rem'}}>
                      <span style={{fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: '400', textTransform: 'uppercase', paddingBottom: '0.3rem'}}> {lowRecord.date} </span>
                      <span style={{ fontSize: '2rem', fontFamily: 'Poppins'}}> {lowRecord.temperature} °C</span>
                      <span style={{fontFamily: 'Inter', fontSize: '0.5rem', fontWeight: '400', textTransform: 'uppercase'}}> Recorded Low </span>
                      
                    </div>
                  </div>    
              </div>

            </div>

          </Item>
        </Grid>

        <Grid xs={6} md={8}>
          <Item style={{  height: '22rem', background: 'linear-gradient(0deg, rgba(13,33,53,1) 0%, rgba(138,109,193,1) 100%)', marginTop: '1.5rem'}}>
            <div className='header-holder'>
              <p style={{fontSize:'0.8rem', textAlign: 'left', paddingLeft: '1.5rem', paddingTop: '1.5rem'}}> WATER QUALITY FORECAST </p>
              


            </div>

          </Item>
        </Grid>

        <Grid xs={6} md={4}>
          <Item style={{  height: '22rem', backgroundColor: '#122B44', marginTop: '1.5rem', marginLeft: '1.5rem'}}>

          </Item>
        </Grid>

      </Grid>
    </div>
  )
}

export default AnalyticMain