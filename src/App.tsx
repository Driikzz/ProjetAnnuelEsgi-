import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeSuiveurPage from './screen/HomeSuiveurPage';
import LoginScreen from './screen/LoginScreen';
import PriseRdvScreen from './screen/PriseRdvScreen';
import PriseRdvMiParcoursScreen from './screen/PriseRdvMiParcoursScreen';
import RelancesScreen from './screen/RelancesScreen';
import BilanScreen from './screen/BilanScreen';
import GestionComptesScreen from './screen/GestionComptesScreen';
import AlertesGeneralesScreen from './screen/AlertesGeneralesScreen';
import SuiviEntretiensScreen from './screen/SuiviEntretiensScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

const AppContent: React.FC = () => {
  const { user } = useAuth(); // Get user from context

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/home-suiveur" : "/login"} replace />} />
      <Route path="/login" element={user ? <Navigate to="/gestion-comptes" replace /> : <LoginScreen />} />
      <Route path="/home-suiveur" element={<HomeSuiveurPage />} />
      <Route path='/rdv' element={<PriseRdvScreen />} />
      <Route path='/rdv-mi-parcours' element={<PriseRdvMiParcoursScreen />} />
      <Route path='/relances' element={<RelancesScreen />} />
      <Route path='/bilan' element={<BilanScreen />} />
      <Route path='/gestion-comptes' element={<GestionComptesScreen />} />
      <Route path='/alertes' element={<AlertesGeneralesScreen />} />
      <Route path='/suivi-entretiens' element={<SuiviEntretiensScreen />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />  {/* This ensures the Navbar is always rendered */}
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
