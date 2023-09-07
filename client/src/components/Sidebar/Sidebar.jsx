import React, { useState, useEffect } from 'react'
import '../styles/Sidebar.css'
import { NavLink, useLocation } from "react-router-dom"
import { SidebarData } from '../../Data/Data'
import AccuracyRate from './AccuracyRate'
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
const realm_lg = new URL('../Sidebar/realm_text_logo.png', import.meta.url)


const Sidebar = () => {
  
    const [selected, setSelected] = useState(null)
    const location = useLocation();
    const activeLink = 'hover: rgb(21, 101, 192)';
    const normalLink = 'hover: rgb(21, 101, 192)';

    function getYesterdayDate() {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
  
      // Format the date to 'Month Date, Year' (e.g., "September 7, 2023")
      const formattedDate = yesterday.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  
      return formattedDate;
    }
  
    const yesterdayDate = getYesterdayDate();

    useEffect(() => {
      const storedSelected = localStorage.getItem('selected');
      if (storedSelected) {
        setSelected(parseInt(storedSelected, 10));
      }
    }, []);

    useEffect(() => {
      // Get the base of the current path
      const baseLocation = location.pathname.split('/')[1];

      // Find the matching item in SidebarData
      const currentIndex = SidebarData.findIndex(item => item.path.includes(`/${baseLocation}`));
      if (currentIndex !== -1) {
          setSelected(currentIndex);
      }
    }, [location]);
  
    useEffect(() => {
      localStorage.setItem('selected', selected);
    }, [selected]);

  

  return (
    <div className="Sidebar">
        <div className="logo">
            <img src={realm_lg} alt="realm" className="realm_logo"/>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => (
            <div 
                key={index}
                className={selected === index ? 'menuItem active' : 'menuItem'} 
                onClick={() => setSelected(index)}
            >
                <NavLink 
                    to={item.path}
                    style={{ color:'white', textDecoration: 'none' }}
                    className={({ isactive }) => (isactive ? activeLink : normalLink)}
                    isActive={() => location.pathname.startsWith(item.path)}
                >
                    <div className="item-holder" style={{display: 'flex', alignItems: 'center'}}>
                        <span className="icon">
                            {item.icon}
                        </span>
                        <span className="title">
                            {item.heading}
                        </span>
                    </div>
                </NavLink>
            </div>
          ))}
            
          <div className="Sign">
            <div className="holder">

              <div className="responses" style={{display:'flex'}}>
                <div className="head-title">
                  <AutoGraphRoundedIcon style={{fontSize: '2rem', color: '#66B2FF'}}/>
                  <div className="res-name">
                    <p className='accuracy'> ACCURACY RESULT </p> 
                    <span className='accuracy-time'> as of {yesterdayDate}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <AccuracyRate/>
                </div>
              </div>
              
            </div>
          </div>

        </div>
    </div>
  )
}

export default Sidebar;
