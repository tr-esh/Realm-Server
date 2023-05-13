import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import MonthLogs from '../MonthLogs';
import '../styles/RecordMain.css'
const record_illustration = new URL('../../img/record_illustration.png', import.meta.url);


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode ===  'dark' ? '#1e88e5' : '#10273d',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: '2.6rem',
  fontWeight: '600',
  fontSize: '1rem',
  fontFamily: 'Poppins, sans-serif',
  color: '#7da4cc',
  boxShadow: 'none',
}));



const RecordMain = () => {

  const [readings, setReadings] = useState([])

  useEffect(() =>{
    const fetchReadings = async () => {
      const response = await fetch('/api/realm/getall')
      const json = await response.json()
      
      if (response.ok){
        setReadings(json)
      }
    }
    fetchReadings()
  }, [])


  return (
    <div className="record-main">
      
              <Item style={{  height: '13rem', margin: '3rem 4rem',
                padding: '2rem 1rem', alignItems: 'center'}} >
                  <div className="head" 
                      style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                    <div className="headname" 
                      style={{  fontFamily: 'Poppins, sans-serif', 
                        fontWeight: '400', lineHeight: '0.8', 
                        display: 'flex', textAlign: 'start', width: '6rem'}} >
                        <span style={{ color:'#FFFF', width: '25rem'}}>RECORD</span>
                        <span style={{ color:'#66B2FF', width: '25rem', color: '#66B2FF'}}>LOGS</span>
                    </div>
                    <div style={{marginTop:'-9rem', paddingLeft:'18rem'}}>
                      <img src={record_illustration} alt="record_item" className="record_illus"
                          style={{ width: '45rem'}}/>
                    </div>
                  </div>
              </Item>
              
            
            <div className='monthly-record-holder'>
                <MonthLogs/>
              </div>
          
    </div>
  )
}

export default RecordMain