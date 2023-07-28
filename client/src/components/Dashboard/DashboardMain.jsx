import React, { useEffect, useState } from 'react'
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';



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

function calculateProgress(temperature, turbidity, phLevel) {
  const statusValues = [temperature.status, turbidity.status, phLevel.status];
  const maxStatusValue = Math.max(
    statusValues.filter(status => status !== "Normal").length,
    2
  );
  return maxStatusValue / statusValues.length;
}

 const value = '';

 ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardMain = () => {


  const [temperature, setTemperature] = useState([])
  const [phLevel, setPhLevel] = useState([])
  const [turbidity, setTurbidity] = useState([])
  const [readings, setReadings]= useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [frequencyData, setFrequencyData] = useState([]);
  




  useEffect(() => {
    

      const fetchData = async () => {
            const [res1, res2] = await Promise.all([
              fetch('/api/realm/fetchParameters'),
              fetch('/api/realm/bardata'),
            ]);

            const json1 = await res1.json()
            const json2 = await res2.json()

          if (res1.ok){
            setTemperature(json1);
            const filteredData = json1.filter(reading => reading.ntu_value !== null);
            setReadings(filteredData);
            setIsLoading(false)
          }
          if (res2.ok){
            setFrequencyData(json2);
          }
    };

    fetchData();
  }, []);



  
  
const graphIllustration = new URL('../../img/graph_illustration.png', import.meta.url)
const bucketIcon = new URL('../../img/icons8-whitebucket-96.png', import.meta.url)
const filterIcon = new URL('../../img/icons8-whitefilter-96.png', import.meta.url)
const kettleIcon = new URL('../../img/icons8-whiteteapot-96.png', import.meta.url)




  return (
     
    

    <div className="Dashboard">
      <Box>
        <Grid container spacing={2}>

        <Grid xs={6} md={6}
             item className="card">
              <Item style={{  height: '14rem', backgroundColor: '#66B2FF'}} elevation={0}>
                  <CardContent  className="Status">
                      <div  className='headings'
                        style={{  fontFamily: 'Poppins, sans-serif', 
                        fontWeight: '600', lineHeight: '0.9', 
                        padding: '0.5rem 1rem'}}> 
                            
                            <span style={{  fontSize: '3rem', 
                            fontWeight:'700' }}
                            >STATUS</span>

                            <span style={{  fontSize: '3rem', 
                            fontWeight:'700', color:'#0A1929', paddingBottom: '1.5rem' }}
                            >TODAY</span>
                            
                            <span style={{  backgroundColor: '#0A1929', fontSize: '1.25em',
                            padding: ' 1.5rem 3.5rem', color: '#ffff', borderRadius: '2.5rem',
                            textAlign: 'center'}}
                            >SAFE</span>
                        </div>

                        <div 
                          style={{  
                          paddingLeft: '1rem', 
                          paddingTop: '0.1rem'}}>
                          
                          <CircularProgressbar 
                             value={calculateProgress(temperature, turbidity, phLevel)} 
                              maxValue={1} 
                              text={`${value * 100}%`}
                              strokeWidth={5}
                              styles={buildStyles({
                              strokeLinecap: "butt",
                              textSize: '0.65rem',
                              textColor: "#0A1929",
                              pathColor: "#0A1929"})}/>
                        </div>

            
                   </CardContent>
            </Item>
          </Grid>

            <Grid xs={6} md={6}
             item className="card">
              <Item style={{  height: '14rem'  }}>
                <CardContent className="Recents"  
                    style={{ padding: '1rem 2rem' }}>
                    
                    <div className="Insight" >
                      <p className='Headline'
                      style={{fontFamily: 'Inter', 
                              fontSize: '0.8rem',
                              textAlign: 'left', 
                              fontWeight: '200'}}> 
                       Suggestions for you today 
                      </p>
                      
                      <div className='Suggestions'
                      style={{display: 'flex', 
                              flexDirection: 'row'}}>
                        
                        <div className='leftSuggestions'
                        style={{display: 'flex', 
                                flexDirection: 'column'}}>
                            <div style={{width: '13rem', height: '5rem', marginTop: '0.5rem'}}> 
                              <div style={{padding:'1rem', display: 'flex'}}>
                                <div style={{backgroundColor:'#122B44', width: '3.5rem', borderRadius: '1.2rem', height:'3.2rem', display: 'flex', alignItems:'center', justifyContent:'center'}}>
                                  <img style={{width: '1.5rem'}} src={bucketIcon} alt="bucket" /> 
                            </div>
                                 <div style={{marginLeft:'0.9rem', lineHeight:'1', margin: 'auto', textAlign: 'left'}}> 
                                    <p> Fetch </p>
                                    <p1 style={{fontSize:'0.8rem', fontFamily:'Inter', fontWeight:'400'}}> Allowed </p1>
                                  </div>
                              </div> 
                        </div>
                            
                            <div 
                            style={{width: '13rem', 
                                    height: '5rem', 
                                    marginTop: '0.5rem'}}> 
                            <div style={{padding:'1rem', display: 'flex'}}>
                              <div style={{backgroundColor:'#122B44', width: '3.5rem', borderRadius: '1.2rem', height:'3.2rem', display: 'flex', alignItems:'center', justifyContent:'center'}}>
                                <img style={{width: '1.5rem'}} src={filterIcon} alt="bucket" /> 
                            </div>
                                    <div style={{marginLeft:'0.9rem', lineHeight:'1', margin: 'auto', textAlign: 'left'}}> 
                                        <p> Filtration </p>
                                        <p1 style={{fontSize:'0.8rem', fontFamily:'Inter', fontWeight:'400'}}> Likely needed </p1>
                                   </div>
                                </div> 
                              </div>
                          </div>
                        
                        <div className='rightSuggestions'
                           style={{display: 'flex', 
                                   flexDirection: 'column', 
                                   marginLeft: '1rem'}}>
                            <div style={{width: '13rem', height: '5rem', marginTop: '0.5rem'}}> 
                                <div style={{padding:'1rem', display: 'flex'}}>
                                  <div style={{backgroundColor:'#122B44', width: '3.5rem', borderRadius: '1.2rem', height:'3.2rem', display: 'flex', alignItems:'center', justifyContent:'center'}}>
                                    <img style={{width: '1.5rem'}} src={kettleIcon} alt="bucket" /> 
                            </div>
                                  <div style={{marginLeft:'0.9rem', lineHeight:'1', margin: 'auto', textAlign: 'left'}}> 
                                    <p> Distillation </p>
                                      <p1 style={{fontSize:'0.8rem', fontFamily:'Inter', fontWeight:'400'}}> Likely needed </p1>
                                  </div>
                            </div> 
                        </div>
                            
                            <div 
                            style={{width: '13rem', 
                                    height: '5rem', 
                                    marginTop: '0.8rem'}}> 
                            </div>
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Item>
            </Grid>

            

            <Grid xs={6} md={4} 
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

            <Grid xs={6} md={4}
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

            <Grid xs={6} md={4}
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
              <Item style={{  height: '15rem' }}> 

                    <div style={{ maxWidth: '500px', margin: '0 auto'}}>
                          {frequencyData ? (
                            <Bar
                              data={{
                                labels: frequencyData.map((data) => data.day),
                                datasets: [
                                  {
                                    label: 'Temperature',
                                    data: frequencyData.map((data) => data.temperature),
                                    backgroundColor: '#4E79B4',
                                    borderRadius: 5,
                                  },
                                  {
                                    label: 'Turbidity',
                                    data: frequencyData.map((data) => data.turbidity),
                                    backgroundColor: '#6F93D3',
                                    borderRadius: 5,
                                  },
                                  {
                                    label: 'pH',
                                    data: frequencyData.map((data) => data.pH),
                                    backgroundColor: '#9FB9DD',
                                    borderRadius: 5,
                                  },
                                ],
                              }}
                              options={{
                                title: {
                                  display: true,
                                  text: 'Weekly High Parameter Frequency',
                                  fontSize: 20,
                                },
                                legend: {
                                  display: true,
                                },
                                scales: {
                                  x: {
                                    stacked: false,
                                    barPercentage: 0.7,
                                  },
                                  y: {
                                    display: false, // Remove the y-axis label
                                    beginAtZero: true,
                                    stacked: false,
                                    grid: {
                                      display: false, // Remove gridlines
                                    },
                                  },
                                },
                                barThickness: 20, // Set the desired width of the bars (in pixels)
                                categoryPercentage: 1.0, // Set the width of the bars relative to the available space
                              }}
                            />
                          ) : (
                            <img style={{width:'20rem', display:'block', margin:'auto'}} src={graphIllustration} alt="No data available" />
                          )}
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