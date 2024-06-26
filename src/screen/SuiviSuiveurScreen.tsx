import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService'; // Assurez-vous que le chemin est correct
import DuoService from '../services/DuoService'; // Assurez-vous que le chemin est correct
import IDuos from '../interfaces/IDuos'; // Assurez-vous que le chemin est correct
import IUsers from '../interfaces/IUsers'; // Assurez-vous que le chemin est correct

interface DetailedDuo {
  duo: IDuos;
  alternant: IUsers | undefined;
  tuteur: IUsers | undefined;
  suiveur: IUsers | undefined;
}

const SuiviSuiveurScreen: React.FC = () => {
  const [detailedDuos, setDetailedDuos] = useState<DetailedDuo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token') || ''; // Assurez-vous de gérer le token en toute sécurité
        const [duos, users] = await Promise.all([
          DuoService.getAllDuos(token), // Méthode pour obtenir tous les duos
          UserService.getAllUsers(token) // Méthode pour obtenir tous les utilisateurs
        ]);
        mapUsersToDuos(users, duos);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const mapUsersToDuos = (users: IUsers[], duos: IDuos[]) => {
    const detailed = duos.map(duo => ({
      duo,
      alternant: users.find(user => user.id === duo.idAlternant),
      tuteur: users.find(user => user.id === duo.idTuteur),
      suiveur: users.find(user => user.id === duo.idSuiveur),
    }));
    setDetailedDuos(detailed);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Optionnellement améliorer la présentation de l'état de chargement
  }

  return (
    <div className="container">
      <h1>Duo Monitoring and Follow-up</h1>
      {detailedDuos.map((detail, index) => (
        <div key={index} className="duo-details">
          <h2>Duo ID: {detail.duo.idDuo}</h2>
          <p>Alternant: {detail.alternant?.name} {detail.alternant?.lastname}</p>
          <p>Tuteur: {detail.tuteur?.name} {detail.tuteur?.lastname}</p>
          <p>Suiveur: {detail.suiveur?.name} {detail.suiveur?.lastname}</p>
          <p>Enterprise: {detail.duo.enterpriseName}</p>
        </div>
      ))}
    </div>
  );
};

export default SuiviSuiveurScreen;
