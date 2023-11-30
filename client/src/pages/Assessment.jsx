import React from 'react'
import '../components/styles/ControlPanel.css'
import AssessMain from '../components/Assessment/AssessMain';
import AssessSide from '../components/Assessment/AssessSide';

const Assessment = () => {
  return (
    <div className="ControlPanel">
        <AssessMain />
        <AssessSide />
    </div>
  )
}

export default Assessment