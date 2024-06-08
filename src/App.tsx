import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './screen/HomePage';
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
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className='navbar-title-container'>
        <div>
          <img src={logo} className='navbar-logo' alt='logo' />
          <div className='separator'></div>
          {user && (
            <div className='userImg-container'>
              <img className="user-img" src={userImage} alt="" />
              <h3>{user.email}</h3>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
      <div className='separator'></div>
      <div className='navbar-links'>
        <Link to="/home" className='navbar-item'>
          <div className='navbar-item-icon'><p>🏠</p></div>
          <div className='navbar-item-title'><p>Home</p></div>
        </Link>
        {!user && (
          <Link to="/login" className='navbar-item'>
            <div className='navbar-item-icon'><p>🔑</p></div>
            <div className='navbar-item-title'><p>Login</p></div>
          </Link>
        )}
        {user && (
          <>
            {user.role === 'Admin / Directeur' && (
              <Link to="/gestion-comptes" className='navbar-item'>
                <div className='navbar-item-icon'><p>👥</p></div>
                <div className='navbar-item-title'><p>Gestion Comptes</p></div>
              </Link>
            )}
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
          </>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path='/login' element={<LoginScreen />} />
          <Route
            path='/rdv'
            element={
              <ProtectedRoute roles={['Suiveur', 'Admin / Directeur']}>
                <PriseRdvScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path='/rdv-mi-parcours'
            element={
              <ProtectedRoute roles={['Suiveur', 'Admin / Directeur']}>
                <PriseRdvMiParcoursScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path='/relances'
            element={
              <ProtectedRoute roles={['Suiveur', 'Admin / Directeur']}>
                <RelancesScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path='/bilan'
            element={
              <ProtectedRoute roles={['Suiveur', 'Admin / Directeur']}>
                <BilanScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path='/gestion-comptes'
            element={
              <ProtectedRoute roles={['Admin / Directeur']}>
                <GestionComptesScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path='/alertes'
            element={
              <ProtectedRoute roles={['Suiveur', 'Admin / Directeur']}>
                <AlertesGeneralesScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path='/suivi-entretiens'
            element={
              <ProtectedRoute roles={['Suiveur', 'Admin / Directeur']}>
                <SuiviEntretiensScreen />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
