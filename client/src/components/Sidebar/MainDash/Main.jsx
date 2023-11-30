import React from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import Analytics from '../../../pages/Analytics'
import Assessment from '../../../pages/Assessment'
import Home from '../../../pages/Home'
import RecordLogs from '../../../pages/RecordLogs'
import RecordMonthHolder from '../../Records/RecordMonthHolder'
import RecordMonthTable from '../../Records/RecordMonthTable'
import './Main.css'

const Main = () => {
  return (
    <div className="Main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Analytics" element={<Analytics />} />
          <Route path="/Logs" element={<RecordLogs />} />
          <Route path="/Assess" element={<Assessment />} />
          <Route path="/Logs/RecordTable/:month" element={<RecordMonthHolder />} />
          <Route path="/table" element={<RecordMonthTable />} />
          <Route path="/Analytics/:parameter" element={<Analytics />} />
          <Route path="/AssessMain/:parameter" element={<Assessment />} />
        </Routes>
    </div>
  )
}

export default Main