import './App.css';
import Main from './components/Sidebar/MainDash/Main';
import Sidebar from './components/Sidebar/Sidebar'
import { BrowserRouter } from 'react-router-dom'
import React from 'react';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="AppGlass">
          <Sidebar />
          <Main />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
