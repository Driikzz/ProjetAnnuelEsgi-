import React, { useEffect, useState } from 'react';
import '../App.css';
import rdvService from '../services/RdvService';
import UserService from '../services/UserService';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr'; // Importez la locale française si nécessaire

const RdvSuiveurScreen: React.FC = () => {
  const token = localStorage.getItem('token') || '';
  const suiveurId = useParams<{ id: any }>().id;
  const [rdv, setRdv] = useState<any[]>([]);
    const [updated, setUpdated] = useState<boolean>(false);

  useEffect(() => {
    const fetchRdv = async () => {
      try {
        const response = await rdvService.getRdvbySuiveurId(suiveurId, token);
        console.log('Rendez-vous:', response);
        setRdv(response);
      } catch (error) {
        console.error('Error fetching rdv:', error);
      }
    };

    if (token) {
      fetchRdv();
    }
  }, [suiveurId, token]);
  
  useEffect(() => {
    const fetchRdv = async () => {
      try {
        const response = await rdvService.getRdvbySuiveurId(suiveurId, token);
        console.log('Rendez-vous:', response);
        setRdv(response);
      } catch (error) {
        console.error('Error fetching rdv:', error);
      }
    };

    if (token) {
      fetchRdv();
    }
  }, [updated]);

  const handleCancelRdv = async (rdvId: number) => {
    try {
      await rdvService.cancelRdv(rdv, token);
      const updatedRdv = rdv.filter(r => r.id !== rdvId);
      setRdv(updatedRdv);
      setUpdated(!updated);
      setTimeout(() => {
        alert('Rendez-vous annulé avec succès');
      }, 100);
    } catch (error) {
      console.error('Error cancelling rdv:', error);
    }
  };

  return (
    <div className="container">
      <h1>Rendez-vous pour le Suiveur</h1>
      <div className="card-container">
        {rdv.map((rdv) => (
          <div className="card" key={rdv.id}>
            <div className="card-content">
              <h2>{rdv.enterpriseName}</h2>
              <p><strong>Alternant:</strong> {rdv.alternant?.name} {rdv.alternant?.lastname} </p>
              <p><strong>Tuteur:</strong> {rdv.tuteur?.name} {rdv.tuteur?.lastname} </p>
              <p><strong>Date:</strong> {moment(rdv.dateRdv).format('DD/MM/YYYY [à] HH[h]mm')}</p>
              <p><strong>Formation:</strong> {rdv.formation}</p>
              <button onClick={() => handleCancelRdv(rdv)}>Annuler</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RdvSuiveurScreen;
