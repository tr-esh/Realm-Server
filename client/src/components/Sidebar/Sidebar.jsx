import React, { useState, useEffect } from 'react'
import '../styles/Sidebar.css'
import { NavLink, useLocation } from "react-router-dom"
import { SidebarData } from '../../Data/Data'
import LinearProgressBar from './ComparativeResult'
import AccuracyRate from './AccuracyRate'
const realm_lg = new URL('../Sidebar/realm_text_logo.png', import.meta.url)
const check_icn = new URL('../../img/icons8-check-64.png', import.meta.url)
const comment_icn = new URL('../../img/icons8-comment-96.png', import.meta.url)

const Sidebar = () => {
  
    const [selected, setSelected] = useState(null)
    const location = useLocation();
    const activeLink = 'hover: rgb(21, 101, 192)';
    const normalLink = 'hover: rgb(21, 101, 192)';

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
              <div className="header-overview">
                Overview
              </div>

              <div className="comparative" style={{display:'flex'}}>
                <div className="head-title">
                  <img src={check_icn} alt="check_icon" className="check_icon"/>
                  <div className="for-name">
                    Comparative Result
                  </div>
                </div>
                <div className="progress-bar">
                  <LinearProgressBar/>
                </div>
              </div>

              <div className="responses" style={{display:'flex'}}>
                <div className="head-title">
                  <img src={comment_icn} alt="comment_icon" className="comment_icon"/>
                  <div className="res-name">
                    Accuracy Result
                  </div>
                </div>
                <div className="progress-bar-res">
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
