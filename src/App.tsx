import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './screen/HomePage';
import LoginScreen from './screen/LoginScreen';
import PriseRdvScreen from './screen/PriseRdvScreen';
import PriseRdvMiParcoursScreen from './screen/PriseRdvMiParcoursScreen';
import RelancesScreen from './screen/RelancesScreen';
import BilanScreen from './screen/BilanScreen';
import GestionComptesScreen from './screen/GestionComptesScreen';
import AlertesGeneralesScreen from './screen/AlertesGeneralesScreen';
import SuiviEntretiensScreen from './screen/SuiviEntretiensScreen';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute redirectTo="/home" inverse>
                <LoginScreen />
              </ProtectedRoute>
            } 
          />
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
};

export default App;
