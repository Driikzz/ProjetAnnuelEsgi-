import React, { useEffect, useState } from 'react';
import '../App.css'; // Assurez-vous que le chemin est correct
import { useParams } from 'react-router-dom';
import rdvService from '../services/RdvService';

const RelancesScreen: React.FC = () => {
  const id = useParams().id;
  const token = localStorage.getItem('token') || '';
  const [duos, setDuos] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchDuoWithoutRdv = async () => {
      try {
        const response = await rdvService.getDuoWithRdv(token, id as any);
        console.log('Duos sans rendez-vous:', response);
        setDuos(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des duos sans rendez-vous:', error);
      }
    }
    if (token) {
      fetchDuoWithoutRdv();
    }
  }, [token]);

  const handleRelancer = () => {
    try {
      rdvService.relance( id, token);
      alert('Relance effectuée avec succès');
    } catch (error) {
      console.error('Erreur lors de la relance:', error);
    }
  };

  return (
    <div className="container">
      <h1>Relances Entreprises</h1>

      <div className="entreprises-list">
        <h2>Liste des Entreprises avec Statut de Relance</h2>
        <div className="card-container">
          {duos.map((duo, index) => (
            <div className="card" key={duo.id}>
              <div className="card-content">
                <h3>{duo?.enterpriseName}</h3>
                <p>Suiveur :{duo.Suiveur.name} {duo.Suiveur.lastname}</p>
                <p>Tuteur : {duo.Tuteur.name} {duo.Tuteur.lastname}</p>
                <p>Alternant : {duo.Alternant.name} {duo.Alternant.lastname}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => handleRelancer()}>Relancer tous les duos</button> 
      </div>
    </div>
  );
};

export default RelancesScreen;
