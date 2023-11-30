import React from 'react'
import '../styles/RecordSide.css'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Divider } from '@mui/material';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode ===  'dark' ? '#1e88e5' : '#10273d',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: '2.5rem',
  fontWeight: '600',
  fontSize: '1rem',
  fontFamily: 'Sk-Modernist-Regular',
  color: '#7da4cc',
  boxShadow: 'none',
}));


const RecordSide = () => {
  return (
    <div className="record-side" >

      <div className='slogan-side' 
            style={{ marginTop: '2rem', fontFamily: 'Sk-Modernist-Regular' }}
        > 
        Unlock insights with 
          <span style={{ color: '#8cacff', 
                         marginLeft: '4px' }}
            >
              organized data - Datasets!
          </span>
      </div>

       <Item style={{ backgroundColor: '#0f263f' }}>
          <div className="Card-top" 
                style={{ marginTop: '4rem' }}>
              <div className="heading-name">
                  <span style={{ color:'#FFFF', 
                                 display: 'flex'}}>
                    Record
                      <Divider orientation="horizontal" 
                               style={{ height: '1.2px', 
                                        backgroundColor: '#bde0ff', 
                                        width: '9rem', 
                                        marginTop: '1rem', 
                                        marginLeft: '1rem'}}
                        /> 
                  </span>
                  <span style={{ color:'#8cacff' }}>
                    Datasets
                  </span>
              </div>

              <div className="content-text">
                  <span>
                    REALM datasets typically include readings of selected physicochemical parameters such as pH, 
                    temperature, and turbidity collected from water samples and transformed into relevant data. 
                    These set of data are prerequisite for the Analytical operations.
                  </span>
              </div>
            </div>
       </Item>

       <Item style={{ marginTop: '4.9rem',
                      backgroundColor: '#0f263f' }}>
        <div className="Card-bottom">
                <div className="heading2-name">
                    <span style={{ color:'#FFFF' }}>
                      Downloadable
                    </span>
                    <span style={{ color:'#8cacff' }}>
                      Sets
                    </span>
                </div>
                <div className="content2-text">
                    <span>
                      With structured datasets and the ability to export findings into 
                      xlxs formats, you can transform raw data into valuable insights.
                    </span>
                </div>
        </div>
        </Item>
        
    </div>
  )
}

export default RecordSide