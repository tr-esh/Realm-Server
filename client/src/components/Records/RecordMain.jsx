import React, { useEffect, useState, useRef} from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import MonthLogs from '../MonthLogs';
import '../styles/RecordMain.css'
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
const record_illustration = new URL('../../img/record_illustration.png', import.meta.url);


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



const RecordMain = () => {
  const MIN_YEAR = 2010;
  const MAX_YEAR = new Date().getFullYear();

  const [readings, setReadings] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() =>{
    const fetchReadings = async () => {
      const response = await fetch('/api/realm/alldata')
      const json = await response.json()
      
      if (response.ok){
        setReadings(json)
      }
    }
    fetchReadings()
  }, [])


  const monthlyReadings = readings.filter(reading => new Date(reading.createdAt).getFullYear() === selectedYear);

  return (
    <div className="record-main">
      
              <Item style={{  height: '8rem', 
                              margin: '5rem 4rem',
                              padding: '1rem 1rem', 
                              alignItems: 'center', backgroundColor: '#8cacff'}} 
                >
                  <div className="head" 
                       style={{ marginTop: '2rem', 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr'}}
                    >
                    <div className="headname" 
                         style={{ fontFamily: 'Sk-Modernist-Regular', 
                                  fontWeight: '400',
                                  lineHeight: '0.8', 
                                  display: 'flex', 
                                  textAlign: 'start', 
                                  width: '6rem'}} >
                        <span style={{ color:'#FFFF', 
                                       width: '25rem'}}>
                          LOG
                        </span>
                        <span style={{ color:'#09111c',  
                                       }}>
                          ENTRIES
                        </span>
                    </div>
                    <div style={{ marginTop: '-0.5rem',
                                  marginLeft:'12rem',
                                  backgroundColor: '#09111c',
                                  width: '18rem',
                                  height: '5rem',
                                  borderRadius: '1.5rem',
                                  display: 'flex',
                                  flexDirection: 'row'}}>
                      <DateRangeRoundedIcon style={{ fontSize: '2.5rem',
                                                     margin: '1.3rem 1.5rem', }} />
                          <Select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            style={{
                                    margin: 'auto', 
                                    width: '200px',
                                    height: '70px',
                                    backgroundColor: '#09111c',
                                    fontFamily: 'Sk-Modernist-Regular',
                                    fontSize: '1.2rem',
                                    color: '#7da4cc',
                                    borderRadius: '1.5rem',
                                  }}
                              >
                            {Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, index) => MIN_YEAR + index).map(year => (
                                <MenuItem key={year} 
                                          value={year}
                                          style={{ textAlign: 'center' }}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                  </div>
              </Item>
              
              <div className='monthly-record-holder'>
                  <MonthLogs readings={monthlyReadings}/>
              </div>
          
    </div>
  )
}

export default RecordMain