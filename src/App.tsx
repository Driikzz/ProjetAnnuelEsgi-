import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './screen/HomePage';
import RegisterScreen from './screen/RegisterScreen';
import LoginScreen from './screen/LoginScreen';
import PriseRdvScreen from './screen/PriseRdvScreen';
import PriseRdvMiParcoursScreen from './screen/PriseRdvMiParcoursScreen';
import RelancesScreen from './screen/RelancesScreen';
import BilanScreen from './screen/BilanScreen';
import GestionComptesScreen from './screen/GestionComptesScreen';
import AlertesGeneralesScreen from './screen/AlertesGeneralesScreen';
import SuiviEntretiensScreen from './screen/SuiviEntretiensScreen'; // Importer la nouvelle page

import logo from './assets/img/logoSU.png';
import userImage from './assets/img/userPicture.png';
import './App.css'; // Assurez-vous d'importer le fichier CSS global

function App() {
  return (
    <Router>
      <div className="navbar">
        <div className='navbar-title-container'>
          <div>
            <img src={logo} className='navbar-logo' alt='logo' />
            <div className='separator'></div>
            <div className='userImg-container'>
              <img className="user-img" src={userImage} alt="" />
              <h3>Hugo Decrypte</h3>
            </div>
          </div>
        </div>
        <div className='separator'></div>
        <div className='navbar-links'>
          <Link to="/home" className='navbar-item'>
            <div className='navbar-item-icon'><p>🏠</p></div>
            <div className='navbar-item-title'><p>Home</p></div>
          </Link>
          <Link to="/register" className='navbar-item'>
            <div className='navbar-item-icon'><p>📝</p></div>
            <div className='navbar-item-title'><p>Register</p></div>
          </Link>
          <Link to="/login" className='navbar-item'>
            <div className='navbar-item-icon'><p>🔑</p></div>
            <div className='navbar-item-title'><p>Login</p></div>
          </Link>
          <Link to="/rdv" className='navbar-item'>
            <div className='navbar-item-icon'><p>📅</p></div>
            <div className='navbar-item-title'><p>Prise de RDV</p></div>
          </Link>
          <Link to="/rdv-mi-parcours" className='navbar-item'>
            <div className='navbar-item-icon'><p>📅</p></div>
            <div className='navbar-item-title'><p>RDV Mi-Parcours</p></div>
          </Link>
          <Link to="/relances" className='navbar-item'>
            <div className='navbar-item-icon'><p>🔄</p></div>
            <div className='navbar-item-title'><p>Relances</p></div>
          </Link>
          <Link to="/bilan" className='navbar-item'>
            <div className='navbar-item-icon'><p>📊</p></div>
            <div className='navbar-item-title'><p>Bilan</p></div>
          </Link>
          <Link to="/gestion-comptes" className='navbar-item'>
            <div className='navbar-item-icon'><p>👥</p></div>
            <div className='navbar-item-title'><p>Gestion Comptes</p></div>
          </Link>
          <Link to="/alertes" className='navbar-item'>
            <div className='navbar-item-icon'><p>⚠️</p></div>
            <div className='navbar-item-title'><p>Alertes Générales</p></div>
          </Link>
          <Link to="/suivi-entretiens" className='navbar-item'>
            <div className='navbar-item-icon'><p>📋</p></div>
            <div className='navbar-item-title'><p>Suivi des Entretiens</p></div>
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path='/register' element={<RegisterScreen />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/rdv' element={<PriseRdvScreen />} />
        <Route path='/rdv-mi-parcours' element={<PriseRdvMiParcoursScreen />} />
        <Route path='/relances' element={<RelancesScreen />} />
        <Route path='/bilan' element={<BilanScreen />} />
        <Route path='/gestion-comptes' element={<GestionComptesScreen />} />
        <Route path='/alertes' element={<AlertesGeneralesScreen />} />
        <Route path='/suivi-entretiens' element={<SuiviEntretiensScreen />} /> {/* Nouvelle page */}
      </Routes>
    </Router>
  );
}

export default App;
