import React from 'react'
import DashboardMain from '../components/Dashboard/DashboardMain'
import DashboardSide from '../components/Dashboard/DashboardSide'
import '../components/styles/Home.css'

const Home = () => {
  return (
    <div className='home'>
        <DashboardMain />
        <DashboardSide />
    </div>
  )
}

export default Home