import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './screen/HomePage';

import logo from './assets/img/logoSU.png';
import RegisterScreen from './screen/RegisterScreen';
import LoginScreen from './screen/LoginScreen';

function App() {
  

  return (
    <Router>
      <div className="navbar">
          <div className='navbar-title-container'>
            <div>
              <img src={logo} className='navbar-logo' alt='logo' />
              <h2  className='navbar-title'>Science-U Dashboard</h2>
            </div>
          </div>

          <div className='separator'></div>

          <div className='navbar-item-container'>
            <Link to="/home" className='navbar-item-container'>
            <div className='navbar-item-icon'><p>Icon</p></div>
            <div className='navabar-item-title'><p>Home</p></div>
            </Link>
          </div>
      </div>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} /> */}
        <Route path='/register' element={<RegisterScreen></RegisterScreen>} /> 
        <Route path='/login' element={<LoginScreen></LoginScreen>} />
      </Routes>
    </Router>
  );
}

export default App;
