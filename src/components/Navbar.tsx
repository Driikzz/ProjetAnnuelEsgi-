import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logoSU.png';
import userImage from '../assets/img/userPicture.png';
import '../screen/styles/Navbar.css'; // Ensure you have the correct path to your CSS file

const Navbar: React.FC = () => {
  const { user, logout, fetchUserData } = [] as any; // Replace 'any' with the correct type

  useEffect(() => {
    if (!user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  console.log('Navbar user:', user);  // Debugging log

  if (!user) {
    return null; // Hide the navbar when the user is not logged in
  }

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
  );
};

export default Navbar;
