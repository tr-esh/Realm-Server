import React from 'react'
import '../components/styles/RecordLog.css'
import RecordMain from '../components/Records/RecordMain';
import RecordSide from '../components/Records/RecordSide';


const RecordLogs = () => {

  return (
    <div className="RecordLogs"> 
      <RecordMain />
      <RecordSide />
    </div>
  )
}

export default RecordLogs