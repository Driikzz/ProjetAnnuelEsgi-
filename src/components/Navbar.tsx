import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/img/logoSU.png';
import userImage from '../assets/img/userPicture.png';
import '../screen/styles/Navbar.css'; // Ensure you have the correct path to your CSS file

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Hide the navbar when the user is not logged in
  }

  const getHomeLink = () => {
    switch (user.role) {
      case 'Suiveur':
        return '/home-suiveur';
      // Add cases for other roles if needed
      default:
        return '/home';
    }
  };

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
        <Link to={getHomeLink()} className='navbar-item'>
          <div className='navbar-item-icon'><p>🏠</p></div>
          <div className='navbar-item-title'><p>Home</p></div>
        </Link>
        {user.role === 'Admin / Directeur' && (
          <Link to="/gestion-comptes" className='navbar-item'>
            <div className='navbar-item-icon'><p>👥</p></div>
            <div className='navbar-item-title'><p>Gestion Comptes</p></div>
          </Link>
        )}
        {['Suiveur', 'Admin / Directeur'].includes(user.role) && (
          <>
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
        {['Tuteur', 'Responsable pédagogique', 'Responsable relations entreprises (Cre)'].includes(user.role) && (
          <>
            {/* Add other links specific to these roles if needed */}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
