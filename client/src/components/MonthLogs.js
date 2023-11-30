import { useNavigate } from "react-router-dom";
import { useState, useMemo } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';
import './styles/month-logs.css';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';

const MonthLogs = ({ readings }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMonthData, setSelectedMonthData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);

    const navigate = useNavigate();

    const processReadings = (readings) => {
        const monthCounts = {
            JANUARY: 0, FEBRUARY: 0, MARCH: 0, APRIL: 0, MAY: 0, JUNE: 0,
            JULY: 0, AUGUST: 0, SEPTEMBER: 0, OCTOBER: 0, NOVEMBER: 0, DECEMBER: 0,
        };

        const monthData = {
            JANUARY: [], FEBRUARY: [], MARCH: [], APRIL: [], MAY: [], JUNE: [],
            JULY: [], AUGUST: [], SEPTEMBER: [], OCTOBER: [], NOVEMBER: [], DECEMBER: [],
        };

        readings.forEach((param) => {
            const month = new Date(param.createdAt).toLocaleString("en-PH", { month: "long" }).toUpperCase();
            if (monthCounts[month] !== undefined) {
                monthCounts[month]++;
                monthData[month].push(param);
            }
        });

        return { monthCounts, monthData };
    };

    const { monthCounts, monthData } = useMemo(() => processReadings(readings), [readings]);

    const months = [
      { abbreviation: "January", name: "JANUARY" },
      { abbreviation: "February", name: "FEBRUARY" },
      { abbreviation: "March", name: "MARCH" },
      { abbreviation: "April", name: "APRIL" },
      { abbreviation: "May", name: "MAY" },
      { abbreviation: "June", name: "JUNE" },
      { abbreviation: "July", name: "JULY" },
      { abbreviation: "August", name: "AUGUST" },
      { abbreviation: "September", name: "SEPTEMBER" },
      { abbreviation: "October", name: "OCTOBER" },
      { abbreviation: "November", name: "NOVEMBER" },
      { abbreviation: "December", name: "DECEMBER" },
  ].map((month) => ({
        ...month,
        data: monthData[month.name],
        count: monthCounts[month.name],
    }));

    const handleMenuClick = (event, month) => {
        setSelectedMonth(month);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMonthClick = async (month, event) => {
        if (event.target.closest('.MuiIconButton-root') !== null) {
            return;
        }

        setSelectedMonth(month);
        const response = await fetch(`/api/realm/monthdata`);
        const data = await response.json();
        const filteredData = data.filter(
            (param) =>
                new Date(param.createdAt)
                .toLocaleString("en-PH", { month: "long" })
                .toUpperCase() === month.name
        );

        setSelectedMonthData(filteredData);
        navigate(`/Logs/RecordTable/${month.abbreviation}`, { state: { data: filteredData } });
    }
  

    return(
      
      <div className="month-logs">
      
          {months.map((month) => (
            <div
              key={month.abbreviation}
              onClick={ month.data && month.data.length > 0 ?
                        (e) => handleMonthClick(month, e) : null
                       }
              className={ `monthly-logs ${!month.data ||
                           month.data.length === 0 ? 
                           'disabled-month' : ''}`
                         }
              role="button"
              onKeyDown={ month.data && month.data.length > 0 ? 
                          (e) => handleMonthClick(month, e) : null
                         }
              tabIndex={0}
              style={{ pointerEvents: month.data && month.data.length > 0 ? 'auto' : 'none' , margin: 'auto'}}
              >
                      
                      <div style={{ width: '250px' }}>
                        <div style={{ marginTop: '3rem', 
                                      }}>
                            <div className="month" 
                                 style={{ display: 'flex', 
                                          flexDirection: 'column',
                                          lineHeight: '0.9', fontSize: '2rem', textAlign: 'center'}}
                                      >
                                <span> {month.name} </span>
                                
                            </div>
                        </div>
                        
                        <Divider
                                orientation="horizontal"
                                style={{ backgroundColor: '#10273d', 
                                        width: '15rem', margin: '0.9rem 0.5rem',
                                        }}
                              />

                        <div className="months" 
                            style={{ display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center'}}>

                              {month.data && month.data.length > 0 ? (
                                <div className='reading-count'
                                    style={{ fontWeight:'600', 
                                             marginTop: '0.5rem'}}
                                  >
                                    {month.data.length}
                                </div>
                                ) : (
                                <div className='no-readings' 
                                      style={{marginTop: '1.5rem'}}>
                                        <DonutLargeRoundedIcon />
                                </div>
                                )}
                          <div className="entry"> 
                            <p className="entry-head"> 
                              entries
                            </p>
                            </div>      
                        </div>
                      </div> 
                </div>
              ))}
                    
        </div>
    )
}
export default MonthLogs