import React from 'react'
import '../components/styles/ControlPanel.css'
import ControlsMain from '../components/Controls/ControlsMain';
import ControlsSide from '../components/Controls/ControlsSide';

const ControlPanel = () => {
  return (
    <div className="ControlPanel">
        <ControlsMain />
        <ControlsSide />
    </div>
  )
}

export default ControlPanel