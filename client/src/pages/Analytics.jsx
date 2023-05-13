import React from 'react'
import '../components/styles/Analytics.css'
import AnalyticMain from '../components/Analytic/AnalyticMain';
import AnalyticSide from '../components/Analytic/AnalyticSide';

const Analytics = () => {
  return (
    <div className="Analytics">
        <AnalyticMain />
        <AnalyticSide />
    </div>
  )
}

export default Analytics