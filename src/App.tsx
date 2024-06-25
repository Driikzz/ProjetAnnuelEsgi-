import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HomeSuiveurPage from './screen/HomeSuiveurPage';
import LoginScreen from './screen/LoginScreen';
import PriseRdvScreen from './screen/PriseRdvScreen';
import PriseRdvMiParcoursScreen from './screen/PriseRdvMiParcoursScreen';
import RelancesScreen from './screen/RelancesScreen';
import BilanScreen from './screen/BilanScreen';
import GestionComptesScreen from './screen/GestionComptesScreen';
import AlertesGeneralesScreen from './screen/AlertesGeneralesScreen';
import SuiviEntretiensScreen from './screen/SuiviEntretiensScreen';
import logo from './assets/img/logoSU.png';
import userImage from './assets/img/userPicture.png';
import './screen/styles/Navbar.css';

import { Provider } from 'react-redux';
import store from './store/store';

const App: React.FC = () => {
  const token = useSelector((state: any) => state.auth.token);
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');

    // Rediriger l'utilisateur vers la page de connexion
    window.location.replace('/login');
  };

  return (
    <Provider store={store}>
      <Router>
        {token ? (
          <div className="navbar">
            <div className='navbar-title-container'>
              <div>
                <img src={logo} className='navbar-logo' alt='logo' />
                <div className='separator'></div>
                {token && (
                  <div className='userImg-container'>
                    <img className="user-img" src={userImage} alt="" />
                    <h3>ddd</h3>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
            <div className='separator'></div>
            <div className='navbar-links'>
              <Link to="/home-suiveur" className='navbar-item'>
                <div className='navbar-item-icon'><p>🏠</p></div>
                <div className='navbar-item-title'><p>Home</p></div>
              </Link>
              <Link to="/gestion-comptes" className='navbar-item'>
                <div className='navbar-item-icon'><p>👥</p></div>
                <div className='navbar-item-title'><p>Gestion Comptes</p></div>
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
        ) : null}
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/home-suiveur" : "/login"} replace />} />
          <Route path="/login" element={token ? <Navigate to="/gestion-comptes" replace /> : <LoginScreen />} />
          <Route path="/home-suiveur" element={<HomeSuiveurPage />} />
          <Route path='/rdv' element={<PriseRdvScreen />} />
          <Route path='/rdv-mi-parcours' element={<PriseRdvMiParcoursScreen />} />
          <Route path='/relances' element={<RelancesScreen />} />
          <Route path='/bilan' element={<BilanScreen />} />
          <Route path='/gestion-comptes' element={<GestionComptesScreen />} />
          <Route path='/alertes' element={<AlertesGeneralesScreen />} />
          <Route path='/suivi-entretiens' element={<SuiviEntretiensScreen />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
