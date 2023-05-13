import React, { useState, useEffect } from 'react'
import '../styles/Sidebar.css'
import { NavLink, useLocation } from "react-router-dom"
import { SidebarData } from '../../Data/Data'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
const realm_lg = new URL('../Sidebar/realm_text_logo.png', import.meta.url)



const Sidebar = () => {
  
    const [selected, setSelected] = useState('')
    const location = useLocation();
    const activeLink = 'hover: rgb(21, 101, 192)'
    const normalLink = 'hover: rgb(21, 101, 192)'

    useEffect(() => {
      const storedSelected = localStorage.getItem('selected');
      if (storedSelected) {
        setSelected(parseInt(storedSelected));
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem('selected', selected);
    }, [selected]);

  return (
    <div className="Sidebar">
        <div className="logo">
        <img src={realm_lg} alt="realm" className="realm_logo"/>
        </div>

        <div className="menu">
            {SidebarData.map((item, index)=>{
              return (
                <div key={index}
                     className={selected === index ? 'menuItem active': 'menuItem'} 
                     onClick = {() => setSelected(index)}
                >
                  <NavLink to={item.path} 
                           style={{ color:'white', textDecoration: 'none' }}
                           className={({isactive}) => (isactive ? activeLink: normalLink)}
                           isActive={location.pathname === item.path}>
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
              )
            })}
            
              <div className="Sign">
                <div className="holder" style={{display:'flex', alignItems:'center'}}>
                  <ExitToAppRoundedIcon className='sidebar-icon' sx={{ fontSize: 30}}/>
                  <span className="Signout">
                      Sign Out
                  </span>
                </div>
              </div>
        </div>
    </div>
  )
}

export default Sidebar