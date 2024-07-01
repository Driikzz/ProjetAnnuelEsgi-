import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeSuiveurPage from './screen/HomeSuiveurPage';
import LoginScreen from './screen/LoginScreen';
import PriseRdvScreen from './screen/PriseRdvScreen';
import SuiviSuiveurScreen from './screen/SuiviSuiveurScreen';
import RelancesScreen from './screen/RelancesScreen';
import GestionComptesScreen from './screen/GestionComptesScreen';
import AlertesGeneralesScreen from './screen/AlertesGeneralesScreen';
import SuiviEntretiensScreen from './screen/SuiviEntretiensScreen';
import GestionEntreprise from './screen/GestionEntreprise';
import logo from './assets/img/logoSU.png';
import userImage from './assets/img/userPicture.png';
import './screen/styles/Navbar.css'; 

import { Provider } from 'react-redux';
import store from './store/store';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import UserService from './services/UserService';

const App: React.FC = () => {
  const [token, setToken] = useState('');
  const { getItem } = useAsyncStorage('token');
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
      const getToken = async () => {
          try {
              const savedToken = await getItem();
              if (savedToken !== null) {
                  setToken(savedToken);
              }
          } catch (error) {
              console.error('Error loading token from AsyncStorage:', error);
          }
      };

      getToken();
  }, []);

  useEffect(() => {
    const FetchUserWithToken = async () => {
      try {
        const response = await UserService.getUser(token!); // Add type assertion (!) to ensure token is of type string
        console.log(" response.data", response);
        setData(response);
      } catch (error) {
        console.error(error);
      }
    }
    if (token) {
      FetchUserWithToken();
    }
  } , [token]);

  const logout = () => {
    setToken('');
  }

  return (
    <Provider store={store}>
      {token ? (
        <Router>
          <div className="navbar">
            <div className='navbar-title-container'>
              <div>
                <img src={logo} className='navbar-logo' alt='logo' />
                <div className='separator'></div>
                {token && ( 
                  <div className='userImg-container'>
                    <br />
                    <img className="user-img" src={userImage} alt="" />
                      <h3>{data?.name}</h3>
                    {/* <button onClick={data.id}>Modifier le compte</button> */}
                    <button onClick={logout}>Déconnexion</button>
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
              <Link to="/suivisuiveur" className='navbar-item'>
                <div className='navbar-item-icon'><p>📅</p></div>
                <div className='navbar-item-title'><p>Suivi des Alternant</p></div>
              </Link>
              <Link to="/relances" className='navbar-item'>
                <div className='navbar-item-icon'><p>🔄</p></div>
                <div className='navbar-item-title'><p>Relances</p></div>
              </Link>
              <Link to="/gestion-entreprise" className='navbar-item'>
                <div className='navbar-item-icon'><p>📊</p></div>
                <div className='navbar-item-title'><p>Gestion Entreprise</p></div>
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
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/home-suiveur" element={<HomeSuiveurPage />} />
            <Route path='/rdv' element={<PriseRdvScreen />} />
            <Route path='/suivisuiveur' element={<SuiviSuiveurScreen />} />
            <Route path='/relances' element={<RelancesScreen />} />
            <Route path='/gestion-entreprise' element={<GestionEntreprise />} />
            <Route path='/gestion-comptes' element={<GestionComptesScreen />} />
            <Route path='/alertes' element={<AlertesGeneralesScreen />} />
            <Route path='/suivi-entretiens' element={<SuiviEntretiensScreen />} />
          </Routes>
        </Router>
      ) : (
        <LoginScreen /> 
      )}
    </Provider>
  );
};

export default App;
