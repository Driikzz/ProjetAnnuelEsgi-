import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import HomeSuiveurPage from './screen/HomeSuiveurPage';
import HomeAdminPage from './screen/HomeAdminPage'; // Import HomeAdminPage
import LoginScreen from './screen/LoginScreen';
import PriseRdvScreen from './screen/PriseRdvScreen';
import SuiviSuiveurScreen from './screen/SuiviSuiveurScreen';
import RelancesScreen from './screen/RelancesScreen';
import GestionComptesScreen from './screen/GestionComptesScreen';
import AlertesGeneralesScreen from './screen/AlertesGeneralesScreen';
import GestionEntreprise from './screen/GestionEntreprise';
import logo from './assets/img/logoSU.png';
import userImage from './assets/img/userPicture.png';
import './screen/styles/Navbar.css';
import './screen/styles/GestionEntreprise.css';

import { Provider } from 'react-redux';
import store from './store/store';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import UserService from './services/UserService';
import GestionComptesScreenSuiveur from './screen/UsersListSuiveur';
import RdvSuiveurScreen from './screen/rdvSuiveur';

const App: React.FC = () => {
  const [token, setToken] = useState('');
  const { getItem } = useAsyncStorage('token');
  const [user, setUser] = useState<any>('');
  const [data, setData] = useState<any>('');

  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }); 
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState('');

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
  }, [token]);

  const logout = () => {
    setToken('');
  }
  
  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
    } else {
      setError('');
      try {
        UserService.updatePassword(form.newPassword, form.oldPassword, data.id, token!);
        console.log('Mot de passe mis à jour avec succès');
      } catch (error) {
        console.error(error);
      }
      setIsFormVisible(false);
    }
  };

  const getRoleBasedRoutes = () => {
    switch (data.role) {
      case 'Admin / Directeur':
      case 'Responsable pédagogique':
        return (
          <>
            <Route path="/home-admin" element={<HomeAdminPage />} />
            <Route path='/gestion-comptes' element={<GestionComptesScreen />} />
            <Route path='/gestion-entreprise' element={<GestionEntreprise />} />
            <Route path='/alertes' element={<AlertesGeneralesScreen />} />
          </>
        );
      case 'Suiveur':
        return (
          <>
            <Route path="/home-suiveur" element={<HomeSuiveurPage />} />
            <Route path='/suivisuiveur' element={<SuiviSuiveurScreen />} />
            <Route path='/relances' element={<RelancesScreen />} />
            <Route path='/gestion-entreprise' element={<GestionEntreprise />} />
            <Route path='/alertes' element={<AlertesGeneralesScreen />} />
            <Route path='/gestion-comptes-suiveurs' element={<GestionComptesScreenSuiveur />} />
            <Route path='/rdv/suiveur/:id' element={<RdvSuiveurScreen />} />
          </>
        );
      case 'Tuteur':
        return (
          <>
            <Route path='/rdv/:id' element={<PriseRdvScreen />} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Provider store={store}>
      {token ? (
        <Router>
          <div className="navbar">
            <div className='navbar-title-container'>
              <div>
                <div>
                  <img src={logo} className='navbar-logo' alt='logo' />
                </div>
                <div className='separator'></div>
                {token && (
                  <div className='userImg-container'>
                    <br />
                    <div>
                      <img className="user-img" src={userImage} alt="" />
                      <button onClick={() => setIsFormVisible(!isFormVisible)} className='button-edit-user'>✒️</button>
                    </div>
                    <h3>{data?.name}</h3>
                    <button onClick={logout}>Déconnexion</button>
                  </div>
                )}
              </div>
            </div>
            <div className='separator'></div>
            <div className='navbar-links'>
              {data.role === 'Suiveur' && (
                <Link to="/home-suiveur" className='navbar-item'>
                  <div className='navbar-item-icon'><p>🏠</p></div>
                  <div className='navbar-item-title'><p>Home</p></div>
                </Link>
              )}
              {(data.role === 'Admin / Directeur' || data.role === 'Responsable pédagogique') && (
                <Link to="/home-admin" className='navbar-item'>
                  <div className='navbar-item-icon'><p>🏠</p></div>
                  <div className='navbar-item-title'><p>Home</p></div>
                </Link>
              )}
              {(data.role === 'Admin / Directeur' || data.role === 'Responsable pédagogique') && (
                <Link to="/gestion-comptes" className='navbar-item'>
                  <div className='navbar-item-icon'><p>👥</p></div>
                  <div className='navbar-item-title'><p>Gestion Comptes</p></div>
                </Link>
              )}
              {data.role === 'Tuteur' && (
                <Link to={`/rdv/${data.id}`} className='navbar-item'>
                  <div className='navbar-item-icon'><p>📅</p></div>
                  <div className='navbar-item-title'><p>Prise de RDV</p></div>
                </Link>
              )}
              {(data.role === 'Suiveur') && (
                <Link to={`/rdv/suiveur/${data.id}`} className='navbar-item'>
                  <div className='navbar-item-icon'><p>📅</p></div>
                  <div className='navbar-item-title'><p>Rendez-Vous</p></div>
                </Link>
              )}
              {data.role === 'Suiveur' && (
                <Link to="/suivisuiveur" className='navbar-item'>
                  <div className='navbar-item-icon'><p>📅</p></div>
                  <div className='navbar-item-title'><p>Suivi des Alternant</p></div>
                </Link>
              )}
              {data.role === 'Suiveur' && (
                <Link to='/gestion-comptes-suiveurs' className='navbar-item'>
                  <div className='navbar-item-icon'><p>👥</p></div>
                  <div className='navbar-item-title'><p>Contact Tuteurs</p></div>
                </Link>
              )}
              {data.role === 'Suiveur' && (
                <Link to={`/relances/${data.id}`} className='navbar-item'>
                  <div className='navbar-item-icon'><p>🔄</p></div>
                  <div className='navbar-item-title'><p>Relances</p></div>
                </Link>
              )}
              {(data.role === 'Suiveur' || data.role === 'Responsable pédagogique' || data.role === 'Admin / Directeur') && (
                <Link to="/gestion-entreprise" className='navbar-item'>
                  <div className='navbar-item-icon'><p>📊</p></div>
                  <div className='navbar-item-title'><p>Gestion Entreprise</p></div>
                </Link>
              )}
              {(data.role === 'Suiveur' || data.role === 'Responsable pédagogique' || data.role === 'Admin / Directeur') && (
                <Link to="/alertes" className='navbar-item'>
                  <div className='navbar-item-icon'><p>⚠️</p></div>
                  <div className='navbar-item-title'><p>Alertes Générales</p></div>
                </Link>
              )}
              {(data.role === 'Suiveur' || data.role === 'Responsable pédagogique') && (
                <Link to="/suivi-entretiens" className='navbar-item'>
                  <div className='navbar-item-icon'><p>📋</p></div>
                  <div className='navbar-item-title'><p>Suivi des Entretiens</p></div>
                </Link>
              )}
            </div>
            {isFormVisible && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close-button" onClick={() => setIsFormVisible(false)}>&times;</span>
                  <h2>Modifier Mot de Passe</h2>
                  <form onSubmit={handleSubmit}>
                  <div className="form-group">
                      <label htmlFor="oldPassword">Ancien Mot de Passe :</label>
                      <input 
                        type="password" 
                        id="oldPassword" 
                        name="oldPassword" 
                        value={form.oldPassword} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="newPassword">Nouveau Mot de Passe :</label>
                      <input 
                        type="password" 
                        id="newPassword" 
                        name="newPassword" 
                        value={form.newPassword} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirmer Mot de Passe :</label>
                      <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={form.confirmPassword} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="button-group">
                      <button type="submit">Mettre à jour</button>
                      <button type="button" onClick={() => setIsFormVisible(false)}>Annuler</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            {(data.role === 'Suiveur' || data.role === 'Responsable pédagogique' || data.role === 'Admin / Directeur') && (
              <Route path='/alertes' element={<AlertesGeneralesScreen />} />
            )}
            {(data.role === 'Admin / Directeur' || data.role === 'Responsable pédagogique') && (
              <>
                <Route path="/home-admin" element={<HomeAdminPage />} />
                <Route path='/gestion-comptes' element={<GestionComptesScreen />} />
                <Route path='/gestion-entreprise' element={<GestionEntreprise />} />
              </>
            )}
            {data.role === 'Suiveur' && (
              <>
                <Route path="/home-suiveur" element={<HomeSuiveurPage />} />
                <Route path='/suivisuiveur' element={<SuiviSuiveurScreen />} />
                <Route path='/relances/:id' element={<RelancesScreen />} />
                <Route path='/gestion-entreprise' element={<GestionEntreprise />} />
                <Route path='/gestion-comptes-suiveurs' element={<GestionComptesScreenSuiveur />} />
                <Route path='/rdv/suiveur/:id' element={<RdvSuiveurScreen />} />
              </>
            )}
            {data.role === 'Tuteur' && (
              <Route path='/rdv/:id' element={<PriseRdvScreen />} />
            )}
            <Route path="*" element={<Navigate to={data.role === 'Admin / Directeur' || data.role === 'Responsable pédagogique' ? "/home-admin" : "/home-suiveur"} />} />
          </Routes>
        </Router>
      ) : (
        <LoginScreen />
      )}
    </Provider>
  );
};

export default App;
