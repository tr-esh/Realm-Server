import React, { useState } from 'react'
import { styled } from '@mui/material/styles';  
import { Divider, Grid } from '@mui/material';
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';
import ElectricMeterRoundedIcon from '@mui/icons-material/ElectricMeterRounded';
import DeviceThermostatRoundedIcon from '@mui/icons-material/DeviceThermostatRounded';
import Tooltip from '@mui/material/Tooltip';
import '../styles/RecordMonthMain.css'
import '../styles/RecordMonthSide.css'
import { useNavigate, useLocation } from "react-router-dom";
import { Paper,
  TableContainer,
  Table, 
  TableHead, 
  TableRow, 
  TableBody, 
  TableCell, 
  TablePagination
  } from '@mui/material'
import '../styles/RecordMonthTable.css'
import moment from 'moment';
import OpacityRoundedIcon from '@mui/icons-material/OpacityRounded';



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
  
  
  const RecordMonthMain = () => {

  const location = useLocation();
  const filteredData = location.state?.data || [];
  
  

  
  const navigate = useNavigate(); 
  const navigatetoRecordLogs = () => {
  
      navigate('/Logs');
    };  

  const noData = new URL('../../img/empty_data.png', import.meta.url)

  const parameter = { temperature: 'TEMPERATURE', 
                     turbidity: 'TURBIDITY',
                     phlevel: 'PH LEVEL'}

  const [showTable, setShowTable] = useState(false);
  const [activeButtons, setActiveButtons] = useState('');
  const [data, setData] = useState('');
  const [type, setType] = useState('');
  const [params, setParams] = useState('');
  const [selectedButton, setSelectedButton] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
  

  const handleClick = ( value, newData, newType, buttonName, buttonIndex) => {
    setActiveButtons(prevState => {
      const newState = [...prevState];
      newState[buttonIndex] = !prevState[buttonIndex];
      return newState;
    });
    setParams({ ...params, [newData]: value });
    setShowTable(!showTable);
    setData(newData);
    setType(newType);
    setSelectedButton(buttonName);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData
  .filter((item) => item.type === type);


  return (

    

  <div className="monthMainContainer" style={{ display: 'grid', gridTemplateColumns: '73rem auto'}}>


    
    <Grid className='Record-Month-Main' style={{  height: '60rem'}}>
        <Item style={{  height: '7rem', margin: '3rem 4rem',
                padding: '2rem 1rem', alignItems: 'center'}} >
                  <div className="header-month" 
                      style={{ marginTop: '2rem',
                               display: 'grid', 
                               gridTemplateColumns: '25rem auto'}}>

                      <div style={{  fontFamily: 'Poppins, sans-serif', 
                                fontWeight: '600', 
                                lineHeight: '0.8', 
                                textAlign: 'start', 
                                width: '8rem', 
                                paddingLeft:'2rem'}} >

                        <div style={{ display: 'flex' }}>
                            <span onClick={navigatetoRecordLogs}  className='backhome' style={{marginRight: '0.7rem'}}>
                              <Tooltip title="Back" arrow style={{fontFamily:'Poppins'}}> 
                              <KeyboardReturnRoundedIcon className='home-icon' sx={{fontSize:'2rem', color: '#BDD2CF', width: '3rem'}}/>
                            </Tooltip>
                            </span>    
                            <div style={{ display: 'flex', 
                                          flexDirection: 'column' }}>
                              <span style={{ color:'#66B2FF', 
                                            width: '25rem', 
                                            fontSize:'2rem', paddingTop:'0.4rem'}}>
                                        
                                              RECORD LOGS
                              </span>

                              <span style={{ color:'#FFFF', 
                                              width: '25rem', 
                                              fontSize:'13px',
                                              fontWeight: '400',
                                              paddingTop: '0.3rem'}}>
                                              Never miss a beat with our log tracking solution.
                              </span>
                            </div>
                        </div>


                        

                        <div style={{marginTop:'-6rem', marginLeft: '26rem'}}>
                              <div style={{ display: 'flex', marginTop:'1rem', 
                                backgroundColor:'#0E2337',
                                height: '6rem',
                                width: '16rem',
                                borderRadius: '2rem',
                                alignItems:'center'}}>
                                <span className='hero-icon-holder' style={{marginRight: '0.7rem',
                                            backgroundColor: selectedButton === 'tempcolor' ? '#8A6DC1' :
                                            selectedButton === 'ntucolor' ? '#F1918F' :
                                            selectedButton === 'pHcolor' ? '#F5D087' : '#10273d'}}>
                                  <DeviceThermostatRoundedIcon className='hero-icon'
                                  sx={{fontSize:'2rem', color: '#eeeeee', width: '3rem'}}/>
                                </span>    
                                <div style={{ display: 'flex', 
                                              flexDirection: 'column'}}>
                                  <span style={{ color:'#66B2FF', 
                                                width: '25rem', 
                                                fontSize:'1.3rem', 
                                                paddingTop:'0.7rem'}}>
                                            
                                                  PARAMETER
                                  </span>

                                  <span style={{ color:'#FFFF', 
                                                  width: '25rem', 
                                                  fontSize:'15.5px',
                                                  fontWeight: '400',
                                                  paddingTop: '0.3rem',
                                                  textTransform:'uppercase'
                                                  }}>
                                                  {type}
                                  </span>
                                </div>
                                <span style={{ display: 'flex', 
                                backgroundColor:'#0E2337',
                                height: '6rem',
                                width: '16rem',
                                borderRadius: '2rem',
                                alignItems:'center',
                                marginLeft:'-13rem'}}>
                                <span className='hero-icon-holder' style={{marginRight: '0.7rem',
                                            backgroundColor: selectedButton === 'tempcolor' ? '#8A6DC1' :
                                            selectedButton === 'ntucolor' ? '#F1918F' :
                                            selectedButton === 'pHcolor' ? '#F5D087' : '#10273d'}}>
                                  <ElectricMeterRoundedIcon className='hero-icon'
                                  sx={{fontSize:'2rem', color: '#eeeeee', width: '3rem'}}/>
                                </span>    
                                <div style={{ display: 'flex', 
                                              flexDirection: 'column'}}>
                                  <span style={{ color:'#66B2FF', 
                                                width: '25rem', 
                                                fontSize:'1.3rem', 
                                                paddingTop:'0.7rem'}}>
                                            
                                                  SENSOR TYPE
                                  </span>

                                  <span style={{ color:'#FFFF', 
                                                  width: '25rem', 
                                                  fontSize:'15px',
                                                  fontWeight: '400',
                                                  paddingTop: '0.3rem',
                                                  }}>
                                                  {data}
                                  </span>
                                </div>
                            </span> 

                            </div> 

                        </div>
                    </div>
                  </div>
              </Item>

              <Item style={{ margin: '0 4rem',
                             width: '88%',
                             height: '60%' }}>
                <div className="table-record">
                {showTable ? (
                   data && type ? (
                    //  <RecordMonthTable />
                    <div className='Month-Table'>
                          <Item style={{ borderRadius: '2rem' }}>
                              <TableContainer  sx={{
                                borderTopRightRadius: '35px',
                                borderTopLeftRadius: '35px',
                                '& th': {
                                  color: 'rgba(96, 96, 96)',
                                  backgroundColor: 'rgba(49, 87, 123, 1)',
                                  position: 'sticky',
                                  top: 0,
                                },
                                '&::-webkit-scrollbar': {
                                  width: 20,
                                },
                                '&::-webkit-scrollbar-track': {
                                  backgroundColor: '#0F263F',
                                  borderRadius: 2,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                  backgroundColor: '#194069',
                                  borderRadius: 2,
                                },
                              }}
                              style={{ height: '500px', overflowY: 'scroll' }}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1rem', textAlign: 'center', borderBottom:'none' }}>Parameter Name</TableCell>
                                    <TableCell style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1rem', textAlign: 'center', borderBottom:'none' }}>Value</TableCell>
                                    <TableCell style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1rem', textAlign: 'center', borderBottom:'none' }}>Status</TableCell>
                                    <TableCell style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1rem', textAlign: 'center', borderBottom:'none'}}>Time & Date</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody style={{ maxHeight: 20 }}>
                                {filteredData
                                    .filter((item) => item.type === type)
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item, index) => (
                                      <TableRow key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                      <TableCell style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins', textTransform: 'uppercase', borderBottom:'none'}}> {item.type}</TableCell>
                                      <TableCell style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins' , borderBottom:'none'}}>{item.value}</TableCell>
                                      <TableCell style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins', textTransform: 'uppercase' , borderBottom:'none' }}>{item.status}</TableCell>
                                      <TableCell style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins', borderBottom:'none' }}>{moment(item.createdAt).format('LT[ • ]LL')}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                              <TablePagination style={{color: 'white'}}
                                  rowsPerPageOptions={[ 25, 45, 50]}
                                  component="div"
                                  count={paginatedData.length}
                                  rowsPerPage={rowsPerPage}
                                  page={page}
                                  onPageChange={handleChangePage}
                                  onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                                    
                          </Item>
                      </div>

                    
                    ) : (
                      <img className='nodata-icon' style={{ width: '30rem', alignItems: 'center', marginTop: '8rem' }} src={noData} alt="Illustration" />
                      
                    )
                  ) : (
                      <img style={{ width: '30rem', alignItems: 'center', marginTop: '8rem' }} src={noData} alt="Illustration" />
                  )}  

                    
                </div>
              </Item>
      </Grid>                                          



      <Grid className='Record-Month-Side'>
          <div className='statement'> 
          Unlock insights with 
          <span style={{ color: '#66B2FF', marginLeft: '4px' }}>
              organized data - Datasets!
          </span>
        </div>
        
        <Item style={{marginTop:'3rem', width:'300px'}}>
            <div className="Card-top" 
                  style={{ marginTop: '1rem', marginLeft:'0.2rem' }}>
                <div className="heading-name" style={{fontSize:'1.rem'}}>
                    <span style={{ color:'#FFFF', display: 'flex'}}>Select
                    <Divider orientation="horizontal" 
                            style={{ height: '1.2px', backgroundColor: '#bde0ff', width: '10.5rem', 
                            marginTop: '1rem', marginLeft: '1rem'}}/> 
                    </span>
                    <span style={{ color:'#66B2FF' }}>Parameter</span>
                    <div className="content2-text">
                      <span style={{fontSize:'0.9rem'}}>
                      Optimize your performance with the right parameters and 
                      gain valuable insights into your operations and make data-driven decisions.
                      </span>
                  </div>
                </div>
            </div>
          </Item>
          
                <div className='parameter-holder' style={{marginTop:'-5rem'}}> 
                <Item> 
                    <button onClick={() => {handleClick(0); handleClick( params.temperature, 'DS18B209', 'temperature', 'tempcolor');}} 
                        className={`param-container ${activeButtons[0] ? 'active' : ''}`} > 
                          <span className='icons-holder' style={{backgroundColor:'#8A6DC1'}}> 
                            <OpacityRoundedIcon className='water-icon' sx={{ fontSize: 30, color:'#8A6DC1', paddingTop:'0.8rem'}}/> 
                            </span>
                        
                        <div className='results'> 
                        <span style={{textAlign:'center', paddingLeft:'0.6rem', color:'#ffff'}}>{parameter.temperature}
                        </span>
                        </div>
                        <span style={{ color:'#66B2FF', fontSize:'0.7rem', fontWeight:'400', marginLeft:'-6.3rem', marginTop:'0.6rem'}}>  
                        {filteredData.filter((item) => item.type === 'temperature').length} results  </span>
                    </button>

                    <button onClick={() => {handleClick(1); handleClick( params.turbidity, 'SEN0189', 'turbidity', 'ntucolor');}} 
                        className={`param-container ${activeButtons[1] ? 'active' : ''}`} > 
                          <span className='icons-holder' style={{backgroundColor:'#F1918F'}}> 
                            <OpacityRoundedIcon className='water-icon' sx={{ fontSize: 30, color:'#F1918F', paddingTop:'0.8rem'}}/> 
                            </span>
                            <div className='results'> 
                        <span style={{textAlign:'center', marginLeft:'-1.1rem', color:'#ffff'}}>{parameter.turbidity}</span>
                        </div>
                        <span style={{ color:'#66B2FF', fontSize:'0.7rem', fontWeight:'400', marginLeft:'-6.4rem', marginTop:'0.6rem'}}> 
                        {filteredData.filter((item) => item.type === 'turbidity').length} results </span>
                    </button>


                    <button onClick={() => {handleClick(2); handleClick( params.phlevel, 'PH-4502C', 'pH', 'pHcolor');}} 
                         className={`param-container ${activeButtons[2] ? 'active' : ''}`}> 
                          <span className='icons-holder' style={{backgroundColor:'#F5D087'}}> 
                            <OpacityRoundedIcon className='water-icon' sx={{ fontSize: 30, color:'#F5D087', paddingTop:'0.8rem'}}/> 
                            </span>
                            <div className='results'> 
                        <span style={{textAlign:'center', marginLeft:'-1.4rem', color:'#ffff'}}>{parameter.phlevel}</span>
                        </div>
                        <span style={{ color:'#66B2FF', fontSize:'0.7rem', fontWeight:'400', marginLeft:'-6.4rem', marginTop:'0.7rem'}}> 
                        {filteredData.filter((item) => item.type === 'pH').length} results </span>
                    </button>
                </Item>
                </div>  
      
      </Grid>

    </div>
  )
}

export default RecordMonthMain