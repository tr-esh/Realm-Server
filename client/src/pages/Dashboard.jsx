import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { CircularProgressbar, 
         buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../components/styles/Dashboard.css';
import { Box, CardContent,
         Divider} from '@mui/material';
import DashTime from '../components/DashTime';
import DashDate from '../components/DashDate';
import DashClock from '../components/DashClock';
import AlertBulletin from '../components/AlertBulletin'
import Welcome from '../components/Welcome';
import { Badge, IconButton, Snackbar } from '@mui/material'
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import  Alert from '@mui/material/Alert';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1e88e5' : '#10273d',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: '1.6rem',
    fontWeight: '600',
    fontSize: '1rem',
    color: '#ffff',
    boxShadow: 'none',
  })
);

const value = 0.45;

const Dashboard = () => {

  const useStyles = styled(() => ({
    badge: {
      position: "absolute",
      top: -10,
      right: -10,
    },
  }));
  
  const classes = useStyles();

  const [temperature, setTemperature] = useState([])
  const [phLevel, setPhLevel] = useState([])
  const [turbidity, setTurbidity] = useState([])
  const [all, setAll] = useState([])
  const [notificationCount, setNotificationCount] = useState(0);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const [res1, res2, res3, res4] = await Promise.all([
        fetch('/api/realm/fetchtemp'),
        fetch('/api/realm/fetchntu'),
        fetch('/api/realm/fetchph'),
        fetch('/api/realm/getall'),
      ]);
      

      const json1 = await res1.json()
      const json2 = await res2.json()
      const json3 = await res3.json()
      const json4 = await res4.json()


      
      if (res1.ok){
        setTemperature(json1);
      }
      if (res2.ok){
        setTurbidity(json2);
      }
      if (res3.ok){
        setPhLevel(json3);  
      }
      if (res4.ok){
        setAll(json4); 
        setNotificationCount(json4.length); 
        setOpen(true);
      }  
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };





  return (

    
    <div className="Dashboard">
      <Box>
      
        <Grid container spacing={2}>
            <Grid xs={6} md={12} >
              <Item style={{marginLeft: '1.1rem'}}> 
                <div className="welcome-statement">
                    <Welcome/>
                </div>
              </Item>
            </Grid>

            <Grid xs={6} md={6}
             item className="card">
              <Item style={{  height: '14rem', boxShadow: 'inset 0 0 0 1px #5090D3'}} elevation={0}>
                  <CardContent  className="Status">
                      <div  className='headings'
                        style={{  fontFamily: 'Poppins, sans-serif', 
                        fontWeight: '600', lineHeight: '0.9', 
                        padding: '0.5rem 1rem'}}> 
                            
                            <span style={{  fontSize: '3rem', 
                            fontWeight:'700' }}
                            >STATUS</span>

                            <span style={{  fontSize: '3rem', 
                            fontWeight:'700', color:'#66B2FF', paddingBottom: '1.5rem' }}
                            >TODAY</span>
                            
                            <span style={{  backgroundColor: '#66B2FF', fontSize: '1.25em',
                            padding: ' 1.5rem 3.5rem', color: '#ffff', borderRadius: '10px',
                            textAlign: 'center'}}
                            >SAFE</span>
                        </div>

                        <div 
                          style={{ width: 175, 
                          height: 175, 
                          paddingLeft: '11.5rem', 
                          paddingTop: '0.5rem'}}>
                          
                          <CircularProgressbar 
                             value={value} 
                              maxValue={1} 
                              text={`${value * 100}%`} 
                              strokeWidth={5}
                              styles={buildStyles({
                              strokeLinecap: "butt",
                              textSize: '0.65rem',
                              textColor: "#66B2FF",
                              pathColor: "#66B2FF"})}/>
                        </div>
                   </CardContent>
            </Item>
          </Grid>

            <Grid xs={6} md={6}
             item className="card">
              <Item style={{  height: '14rem' }}>
                <CardContent className="Recents"  
                    style={{ padding: '1rem 2rem' }}>
                    <div className="Header" >
                    <span style={{  fontSize: '1.3rem', 
                              fontWeight:'600', fontFamily: 'Poppins, sans serif', color: '#66B2FF'}}
                              >ALERT
                              <span style={{  fontSize: '1.3rem', 
                              fontWeight:'600', fontFamily: 'Poppins, sans serif' , color: '#ffff'}}
                              >BULLETIN</span></span>
                              
                               <Divider orientation="horizontal" 
                                style={{ height: '1.2px', backgroundColor: '#5090D3', width: '25rem', marginTop:'0.7rem'}}/> 
                          
                          
                          <IconButton sx={{ marginTop: '-15px'}}>
                              <Badge  color="error" sx={{ fontWeight:'800' ,fontSize: '2rem', color: 'red'}}
                                className={classes.badge}
                                badgeContent={notificationCount}
                              >
                              <CircleNotificationsRoundedIcon sx={{ fontSize: 35, color:'#ffff'}} />
                            </Badge>
                          </IconButton>
                         
                          <Snackbar  autoHideDuration={5000} style={{  borderRadius:'0.5rem' , backdropFilter:'blur(10px)'}} 
                                              anchorOrigin= {{vertical: 'top', horizontal: 'right'}}
                                              open={open}
                                              message={`${notificationCount} suspicious findings`}
                                              onClose={handleClose}>

                          <Alert style={{fontFamily: 'Poppins', fontSize:'1rem', color:'#ffff',
                                         background:'rgba(255, 138, 128, 0.15)', width:'25rem', 
                                         display:'flex', alignItems:'center', height: '3rem', fontWeight:'400', borderRadius:'0.5rem', 
                                         boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', backdropFilter:'blur(10.8px)'}} 
                                         severity="error" sx={{ width: '100%' }}
                                        > <span style={{fontWeight:'400'}}> ALERT BULLETIN: </span> {`${notificationCount} `}  SUSPICIOUS FINDINGS!

                          </Alert>                     
                          </Snackbar>
                     </div>
                      

                   <div className='bulletin-record'> 
                   {all && all.map((all) => (
                        <AlertBulletin key={all._id} all={all}/>
                      ))}
                   </div>

                </CardContent>
              </Item>
            </Grid>

            <Grid xs={6} md={4} 
            item className="card">
              <Item style={{  height: '10rem', backgroundColor: '#10273d' }} >
                  <CardContent style={{  display: 'flex', fontFamily: 'Inter',
                    flexDirection: 'column', padding: '1.5rem 1.5rem' }} 
                    className="Temperature" >
                    
                    <div className="TopCon" >
                        <div 
                          style={{  display: 'flex', 
                          flexDirection: 'column', textAlign: 'start',
                          fontSize: '1.25rem',
                          lineHeight: '1' }}>
                          <span style={{ fontWeight: '400', fontSize: '1.1rem'}}>WATER</span>
                          <span style={{ color:'#66B2FF', fontWeight: '700'}}
                          >TEMPERATURE</span>
                        </div>

                        <Divider orientation="vertical" 
                                style={{ height: '2.2rem', backgroundColor: '#5090D3', width: '1.2px'}}/>

                        <div className="dataTemp">
                        <span key={temperature.id}>
                            {temperature.temperature_value} <span style={{color: '#66B2FF'}}>°C</span>
                          </span>
                      </div>
                    </div>
                 


                    <div className="BottomCon" 
                          style={{ paddingTop: '1rem' }}>
                        <div 
                          style={{ borderRadius: '10px', 
                          fontWeight: '700', 
                          padding: '2ch', textAlign: 'center', 
                          backgroundColor:'#122B44'  }}>
                          <div className="Tempstamp">
                        <span key={temperature.id} 
                              style={{color: temperature.status === "Normal" ? "#bedaff" : 
                                              temperature.status === "Conditional" ? "#f0de53" : 
                                              temperature.status === "warning: Rising Temperature" ? "#ffc661" : "white"}}>
                            {temperature.status}
                        </span>
                      </div>
                        </div>
                    </div>
                  </CardContent>
              </Item>
            </Grid>

            <Grid xs={6} md={4}
             item className="card">
              <Item style={{  height: '10rem', backgroundColor: '#10273d' }} >
              <CardContent style={{  display: 'flex', fontFamily: 'Inter',
                  flexDirection: 'column', padding: '1.5rem 1.5rem' }} 
                    className="Turbidity" >
                      <div className="TopCon" >
                          <div 
                          style={{  display: 'flex', 
                          flexDirection: 'column', textAlign: 'start', 
                          fontSize: '1.15rem',
                          lineHeight: '1' }}>
                          <span style={{ fontWeight: '400', fontSize: '1.1rem'}}>WATER</span>
                          <span style={{ color:'#66B2FF' , fontWeight: '700'}} >TURBIDITY</span>
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
                        style={{ borderRadius: '10px', 
                        fontWeight: '700', 
                        padding: '2ch', textAlign: 'center', 
                        backgroundColor:'#122B44'}}>
                          <div className="turbidstamp">
                            <span key={turbidity.id}
                                  style={{color: turbidity.status === "Normal" ? "#bedaff" : 
                                                turbidity.status === "Conditional" ? "#f0de53" : 
                                                turbidity.status === "warning: High Turbid" ? "#ffc661" : "white"}}>
                                {turbidity.status}
                            </span>
                          </div>
                        </div>
                    </div>
                  </CardContent>
              </Item>
            </Grid>

            <Grid xs={6} md={4}
             item className="card">
              <Item style={{  height: '10rem', backgroundColor: '#10273d' }} >
              <CardContent style={{  display: 'flex', fontFamily: 'Inter',
                  flexDirection: 'column', padding: '1.5rem 0.9rem' }} 
                  className="pH" >
                    <div className="TopCon" >
                        <div 
                        style={{  display: 'flex', 
                        flexDirection: 'column', textAlign: 'start', 
                        fontSize: '1.25rem',
                        lineHeight: '1' }}>
                          <span style={{ fontWeight: '400', fontSize: '1.1rem'}}>PH</span>
                          <span style={{ color:'#66B2FF', fontWeight: '700', paddingRight: '4rem'}} >LEVEL</span>
                        </div>
                        <Divider orientation="vertical" 
                                style={{ height: '2.2rem', backgroundColor: '#5090D3', width: '1.2px'}}/> 
                        <div className="dataPH">
                          <span key={phLevel.id}>
                            {phLevel.ph_value} <span style={{color: '#66B2FF'}}>PH UNIT</span>
                          </span>
                        </div>
                    </div>

                    <div className="BottomCon" 
                    style={{ paddingTop: '1rem' }}>
                        <div 
                        style={{ borderRadius: '10px', 
                        fontWeight: '700', 
                        padding: '2ch', textAlign: 'center', 
                        backgroundColor:'#122B44'}}>
                          <div className="phtamp">
                            <span key={phLevel.id}
                            style={{color: phLevel.status === "Normal" ? "#bedaff" : 
                            phLevel.status === "Conditional" ? "#f0de53" : 
                            phLevel.status === "Caution: Acidic" ? "#ffc661" : "white"}}>
                                {phLevel.status}
                            </span>
                          </div>
                        </div>
                    </div>
                  </CardContent>
              </Item>
            </Grid>

            <Grid xs={6} md={8}
            item className="card">
              <Item style={{  height: '15rem' }}
              >BARGRAPH</Item>
              </Grid>
              <Grid xs={6} md={4}
              item className="card">
                <Item style={{  height: '15rem' }} >
                  <CardContent style={{padding: '1.25rem 1.5rem'}}>
                    <div className="upperCon"
                      style={{ display: 'flex', gap: '12rem',
                      flexDirection: 'row', paddingBottom: '1rem'}}>
                          <div style={{ fontSize: '2rem', fontFamily: 'Inter',
                          fontWeight: '700', color:'#66B2FF'}}>
                        TO<span style={{color:'#ffff'}}>DAY</span>
                      </div>
                  </div>
                  <div className="mainCon" style={{
                    display: 'flex'}}>

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
                      
                      <div className="right" style={{ paddingLeft: '3.3rem' }}>
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

export default Dashboard