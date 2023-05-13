import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';




export const SidebarData = [
    {
        icon: <DashboardRoundedIcon className='sidebar-icon'  sx={{ fontSize: 30, paddingTop:'0.5rem'}}/> ,
        path: "/",
        heading: "Dashboard",
    },
    {
        icon: <TimelineRoundedIcon className='sidebar-icon'sx={{ fontSize: 30, paddingTop:'0.5rem'}}/>,
        path: "/Analytics",
        heading: "Analytics",
    },
    {
        icon: <FormatListBulletedRoundedIcon className='sidebar-icon' sx={{ fontSize: 30, paddingTop:'0.5rem'}}/> ,
        path: "/Logs",
        heading: "Record Logs",
    },
    // {
    //     icon: <SettingsRoundedIcon className='sidebar-icon' sx={{ fontSize: 30, paddingTop:'0.5rem'}}/> ,
    //     path: "/Controls",
    //     heading: "Control Panel",
    // },
    
];

export const ParameterDetais = [
    {
        name: "Temperature",
        color: "#8A6DC1"
    }, 
    {
        name: "Turbidity",
        color: "#F1918F"
    }, 
    {
        name: "pH Level",
        color: "#F5D087"
    }
];

