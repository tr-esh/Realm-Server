import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { CircularProgressbar, 
         buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../styles/Dashboard.css';
import { Box, CardContent,
         Divider, Skeleton } from '@mui/material';
import DashTime from '../DashTime';
import DashDate from '../DashDate';
import DashClock from '../DashClock';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import TemperatureHome from '../Analytic/Predictive/TemperatureHome';
import TurbidityHome from '../Analytic/Predictive/TurbidityHome';
import PhHome from '../Analytic/Predictive/PhHome';
import FrequencyData from './FrequencyData';




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



const DashboardMain = () => {


  const [temperature, setTemperature] = useState([])
  const [phLevel, setPhLevel] = useState([])
  const [turbidity, setTurbidity] = useState([])
  const [readings, setReadings]= useState([])
  const [isLoading, setIsLoading] = useState(true);

  
  const [latestReadings, setLatestReadings] = useState([]);
  const [overallIndex, setOverallIndex] = useState(null);
  const [interpretation, setInterpretation] = useState('');

  const getPathColor = (percentage) => {
    if (percentage <= 25) return '#0A1929';  
    if (percentage <= 50) return '#FFC300';
    if (percentage <= 75) return '#ffc661'; 
    return '#FF6384';                         
  }




  useEffect(() => {
    

      const fetchData = async () => {
            const [res1, res3] = await Promise.all([
              fetch('/api/realm/fetchParameters'),
              fetch('api/realm/fetchAllParameters')
            ]);

            const json1 = await res1.json()
            const json3 = await res3.json()

          if (res1.ok){
            setTemperature(json1);
            const filteredData = json1.filter(reading => reading.ntu_value !== null);
            setReadings(filteredData);
            setIsLoading(false)
          }
          if (res3.ok){
            setLatestReadings(json3);
          }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (latestReadings.length === 3) {
      const temperatureWeight = 0.3;
      const phWeight = 0.4;
      const turbidityWeight = 0.3;

      let temperatureValue = latestReadings[0].temperature_value;
      if (temperatureValue > 25 && temperatureValue <= 50) {
        temperatureValue = 25; // Cap value at 25 for the higher range
      }
      const normalizedTemperature = (temperatureValue - 5) / (25 - 5);

      // Identify pH range
      let phValue = latestReadings[2].ph_value;
      if (phValue < 6.5 && phValue >= 1.0) {
        phValue = 6.5; // Cap value at 6.5 for the lower range
      }
      const normalizedPh = (phValue - 6.5) / (8.5 - 6.5);

      const normalizedTurbidity = latestReadings[1].ntu_value / 10;

      const temperatureSubIndex = normalizedTemperature * temperatureWeight;
      const phSubIndex = normalizedPh * phWeight;
      const turbiditySubIndex = normalizedTurbidity * turbidityWeight;

      const calculatedOverallIndex = temperatureSubIndex + phSubIndex + turbiditySubIndex;

      setOverallIndex(calculatedOverallIndex);
      

      if (calculatedOverallIndex < 0.4) {
        setInterpretation('Safe');
      } else if (calculatedOverallIndex < 0.6) {
        setInterpretation('Conditional');
      } else {
        setInterpretation('Unsafe');
      }
    }
  }, [latestReadings]);





  return (
     
    

    <div className="Dashboard">
      <Box>
        <Grid container spacing={2}>

        <Grid xs={12} md={6} lg= {6}
             item className="card">
              <Item style={{  height: '14rem', backgroundColor: '#66B2FF'}} elevation={0}>
                  <CardContent  className="Status">
                      <div  className='headings'
                        style={{  fontFamily: 'Poppins, sans-serif', 
                        fontWeight: '600', lineHeight: '0.9', 
                        padding: '0.5rem 0.3rem'}}> 
                            
                            <span style={{  fontSize: '1.5rem', 
                            fontWeight:'700' }}
                            >PHYSICOCHEMICAL</span>

                            <span style={{  fontSize: '3rem', 
                            fontWeight:'700', color:'#0A1929', paddingBottom: '1.5rem' }}
                            >STATUS</span>
                            
                            {latestReadings.length === 3 && (
                            <span style={{  backgroundColor: '#0A1929', fontSize: '1em',
                            padding: ' 1.5rem 3.5rem', color: '#ffff', borderRadius: '2.5rem',
                            textAlign: 'center', textTransform: 'uppercase'}}
                            >{interpretation}
                            </span>
                            
                            )}
                        </div>

                        <div 
                          style={{   
                          paddingTop: '0.1rem'}}>
                          
                          <CircularProgressbar 
                              className="custom-progress-bar"
                              value={overallIndex} 
                              maxValue={1} 
                              text={`${(overallIndex * 100).toFixed(2)}%`}
                              strokeWidth={5}
                              styles={buildStyles({
                                  strokeLinecap: "round",
                                  textSize: '0.6rem',
                                  textColor: "#0A1929",
                                  pathColor: getPathColor(overallIndex * 100),
                                  fontFamily: 'Poppins'
                              })}
                          />


                        </div>

            
                   </CardContent>
            </Item>
          </Grid>

          <Grid xs={6} md={6} lg= {6} 
          item className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Item style={{ height: '14rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardContent className="Recents">
              <div className='card-overview' style={{ textAlign: 'center' }}>

              <p style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: '1.3rem', textAlign: 'left', marginBottom: '3rem', textTransform: 'uppercase' }}>
                  Forecast <span style={{color: '#66B2FF'}}> Tomorrow </span>
                  <p style={{fontWeight: '400', fontSize: '0.7rem', lineHeight: '3px', textTransform: 'Capitalize'}}>
                     Expected insights for tomorrow. Click to view more.
                    </p>

                </p>
              
                  
               
                <div className='home-cast' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '10rem', margin: 'auto' }}>
                    <Link to="/Analytics/temperature" style={{ display: 'block', textDecoration: 'none', color: 'white' }}>
                      <TemperatureHome />
                    </Link>
                  </div>
                  <div style={{ width: '10rem', margin: 'auto' }}>
                    <Link to="/Analytics/turbidity" style={{ display: 'block', textDecoration: 'none', color: 'white' }}>
                      <TurbidityHome />
                    </Link>
                  </div>
                  <div style={{ width: '10rem', margin: 'auto' }}>
                    <Link to="/Analytics/ph" style={{ display: 'block', textDecoration: 'none', color: 'white' }}>
                      <PhHome />
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Item>
        </Grid>


            

            <Grid xs={12} md={4} 
            item className="card">
                {isLoading ? (
              <Skeleton variant="rect" height={150} style={{borderRadius:'1.6rem'}}/>
              ) : (
              readings.map(readings => (
              <Item style={{  height: '10rem', backgroundColor: '#10273d' }} >
                  <CardContent style={{  display: 'flex', fontFamily: 'Inter',
                    flexDirection: 'column', padding: '1.5rem 1rem' }} 
                    className="Temperature" >
                    
                    <div className="TopCon" >
                        <div 
                          style={{  display: 'flex', 
                          flexDirection: 'column', textAlign: 'start',
                          fontSize: '1.25rem',
                          lineHeight: '1' }}>
                          <span style={{ fontWeight: '400', fontSize: '1rem'}}>WATER</span>
                          <span style={{ color:'#66B2FF', fontWeight: '700', fontSize: '1rem'}}
                          >TEMPERATURE</span>
                        </div>

                        <Divider orientation="vertical" 
                                style={{ height: '2.2rem', backgroundColor: '#5090D3', width: '1.2px'}}/>

                        <div className="dataTemp">
                        
                        <span key={readings.id}>
                            {readings.temperature_value} <span style={{color: '#66B2FF'}}>°C</span>
                          </span>
                          
                      </div>
                    </div>
                 

                      
                    <div className="BottomCon" 
                          style={{ paddingTop: '1.3rem' }}>
                        <div 
                          style={{ borderRadius: '2.5rem', 
                          fontWeight: '700', 
                          padding: '2ch', textAlign: 'center', 
                          backgroundColor:'#122B44'}}>
                          <div className="Tempstamp">
                        <span key={readings.id} 
                              style={{color: readings.status[0] === "Normal" ? "#bedaff" : 
                                              readings.status[0] === "Conditional" ? "#f0de53" : 
                                              readings.status[0] === "Warning: Rising Temperature" ? "#FF6384" : "white",
                                              fontSize:'0.9rem'}}>
                            {readings.status[0]}
                        </span>
                      </div>
                        </div>
                    </div>
                  </CardContent>
              </Item>
              ))
              )}
            </Grid>

            <Grid xs={12} md={4}
             item className="card">
              {isLoading ? (
              <Skeleton variant="rect" height={150} style={{borderRadius:'1.6rem'}}/>
              ) : (
               readings.map(turbidity => (
              <Item style={{  height: '10rem', backgroundColor: '#10273d' }} >
              <CardContent style={{  display: 'flex', fontFamily: 'Inter',
                  flexDirection: 'column', padding: '1.5rem 1rem' }} 
                    className="Turbidity" >
                      <div className="TopCon">
                          <div 
                          style={{  display: 'flex', 
                          flexDirection: 'column', textAlign: 'start', 
                          fontSize: '1.15rem',
                          lineHeight: '1' }}>
                          <span style={{ fontWeight: '400', fontSize: '1rem'}}>WATER</span>
                          <span style={{ color:'#66B2FF' , fontWeight: '700', fontSize: '1rem'}} >TURBIDITY</span>
                          </div>

                          <Divider orientation="vertical" 
                                style={{ height: '2.2rem', backgroundColor: '#5090D3', width: '1.2px'}}/> 
                          
                          <div className="dataTurbid">
                          <span key={turbidity.id}>
                            {turbidity.ntu_value} <span style={{color: '#66B2FF'}}>NTU</span>
                          </span>
                        </div>
                      </div>

                    <div className="BottomCon" 
                    style={{ paddingTop: '1.3rem' }}>
                        <div 
                        style={{ borderRadius: '2.5rem', 
                        fontWeight: '700', 
                        padding: '2ch', textAlign: 'center', 
                        backgroundColor:'#122B44'}}>
                          <div className="turbidstamp">
                            <span key={turbidity.id}
                                  style={{color:turbidity.status[1] === "Normal" ? "#bedaff" : 
                                                turbidity.status[1] === "Conditional" ? "#f0de53" : 
                                                turbidity.status[1] === "Warning: High Turbid" ? "#FF6384" : "white",
                                                fontSize:'0.95rem'}}>
                                {turbidity.status[1]}
                            </span>
                          </div>
                        </div>
                    </div>
                  </CardContent>
              </Item>
               ))
               )}
            </Grid>

            <Grid xs={12} md={4}
             item className="card">
               {readings.map(phLevel => (
              <Item style={{  height: '10rem', backgroundColor: '#10273d' }} >
              <CardContent style={{  display: 'flex', fontFamily: 'Inter',
                  flexDirection: 'column', padding: '1.5rem 0.5rem' }} 
                  className="pH" >
                    <div className="TopCon" >
                        <div 
                        style={{  display: 'flex', 
                        flexDirection: 'column', textAlign: 'start', 
                        fontSize: '1.25rem',
                        lineHeight: '1' }}>
                          <span style={{ fontWeight: '400', fontSize: '1rem'}}>PH</span>
                          <span style={{ color:'#66B2FF', fontWeight: '700', paddingRight: '4rem', fontSize: '1rem'}} >LEVEL</span>
                        </div>
                        <Divider orientation="vertical" 
                                style={{ height: '2.2rem', backgroundColor: '#5090D3', width: '0.1sspx'}}/> 
                        <div className="dataPH">
                          <span key={phLevel.id}>
                            {phLevel.ph_value} <span style={{color: '#66B2FF'}}>PH UNIT</span>
                          </span>
                        </div>
                    </div>

                    <div className="BottomCon" 
                    style={{ paddingTop: '1.3rem' }}>
                        <div 
                        style={{ borderRadius: '2.5rem', 
                        fontWeight: '700', 
                        padding: '2ch', textAlign: 'center',                  
                        backgroundColor:'#122B44'}}>
                          <div className="phtamp">
                            <span key={phLevel.id}
                            style={{color: phLevel.status[2] === "Normal" ? "#bedaff" : 
                            phLevel.status[2] === "Conditional" ? "#f0de53" :
                            phLevel.status[2] === "High Alkalinity" ? "#ffaf7a" : 
                            phLevel.status[2] === "Caution: Acidic" ? "#ffc661" : "white",
                            fontSize:'0.95rem'}}>
                                {phLevel.status[2]}
                            </span>
                          </div>
                        </div>
                    </div>
                  </CardContent>
              </Item>
              ))}
            </Grid>

            <Grid xs={6} md={7}
            item className="card">
              <Item style={{  height: '15rem'}}> 

                    <div style={{ width: '35rem', margin: 'auto'}}>
                      <p className='anomaly-tag'> DAILY <span className='anomaly-san'> ANOMALY </span> TRACKING </p>

                    <FrequencyData />
                        </div>
              </Item>
              </Grid>
              
              <Grid xs={6} md={5}
              item className="card">
                 <Item style={{  height: '15rem' }} >
                  <CardContent style={{padding: '1.25rem 1.5rem'}}>
                    <div className="upperCon"
                      style={{ display: 'flex', gap: '14rem', marginTop: '-1.6rem', marginLeft: '-2rem',
                                  width: '388px', height: '60px',
                                  flexDirection: 'row', padding: '0 2ch',backgroundColor: '#66B2FF', 
                                  borderTopLeftRadius: '1.6rem', borderTopRightRadius: '1.6rem',
                                  alignItems:'center'}}>
                        <span style={{ fontSize: '2rem', fontFamily: 'Inter',
                            fontWeight: '700', color:'#0A1929', paddingLeft:'0.6rem'}}>
                          TODAY
                        </span>
                        <EventNoteRoundedIcon sx={{fontSize:'2rem', color: '#0A1929'}}/>
                    </div>
                  <div className="mainCon" style={{
                    display: 'flex', marginTop: '3rem'}}>

                      <div className="left-time" 
                        style={{  
                        fontSize: '0.9rem',
                        fontWeight: '600', 
                        fontFamily: 'Inter',
                        textAlign: 'start'
                        }}>
                          <span style={{ color:'#66B2FF'}}>TIME</span>
                          <span style={{ color:'#ffff', fontSize: '1.2rem', fontWeight: '500', lineHeight: '0.9'}}>
                            <DashTime/>
                          </span> 
                          <br/>     
                          <span style={{ color:'#66B2FF'}}>DATE</span>
                          <span style={{ color:'#ffff', fontSize: '1.2rem', fontWeight: '500', lineHeight: '0.9', textTransform: 'uppercase'}}>
                            <DashDate/>
                          </span>
                          
                        
                      </div>
                      
                      <div className="right" style={{ marginTop: '1rem', paddingLeft: '6rem'}}>
                          <DashClock/>
                      </div>
                  </div>
                </CardContent>
              </Item>  
            </Grid>
        </Grid>
        </Box>
    </div>
  )
}

export default DashboardMain