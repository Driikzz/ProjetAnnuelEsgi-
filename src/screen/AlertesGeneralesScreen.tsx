import React, { useState } from 'react';
import './styles/AlertesGeneralesScreen.css'; // Importer le fichier CSS

interface Alerte {
  id: number;
  type: string;
  titre: string;
  description: string;
  date: string;
}

const AlertesGeneralesScreen: React.FC = () => {
  const [alertes, setAlertes] = useState<Alerte[]>([
    { id: 1, type: 'Suite d’Études', titre: 'Intention de poursuivre les études', description: 'Étudiant A souhaite poursuivre ses études.', date: '2024-05-20' },
    { id: 2, type: 'Recrutement d’Entreprises', titre: 'Recrutement par Entreprise X', description: 'Entreprise X recrute pour un poste Y.', date: '2024-05-22' },
    { id: 3, type: 'Stage', titre: 'Offre de stage', description: 'Entreprise Y offre un stage pour l’été.', date: '2024-05-23' },
    { id: 4, type: 'Conférence', titre: 'Conférence Z', description: 'Conférence sur l’intelligence artificielle.', date: '2024-05-24' },
    { id: 5, type: 'Stage', titre: 'Offre de stage', description: 'Entreprise Y offre un stage pour l’été.', date: '2024-05-23' },
    { id: 6, type: 'Conférence', titre: 'Conférence Z', description: 'Conférence sur l’intelligence artificielle.', date: '2024-05-24' },
    { id: 7, type: 'Stage', titre: 'Offre de stage', description: 'Entreprise Y offre un stage pour l’été.', date: '2024-05-23' },
    { id: 8, type: 'Conférence', titre: 'Conférence Z', description: 'Conférence sur l’intelligence artificielle.', date: '2024-05-24' },

    // Ajoutez plus d'alertes ici si nécessaire
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [newAlertes, setNewAlertes] = useState(2); // Exemple de nouvelles alertes depuis la dernière connexion

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? alertes.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === alertes.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDismiss = (id: number) => {
    setAlertes(alertes.filter((alerte) => alerte.id !== id));
  };

  const visibleAlertes = alertes.slice(currentIndex, currentIndex + 3).concat(alertes.slice(0, Math.max(0, currentIndex + 3 - alertes.length)));

  return (
    <div className="container">
      <div>
        <h1 className="header">Tableau de Bord des Alertes</h1>

        <div className="notificationSummary" onClick={() => setShowPopup(true)}>
          <span>Notifications: {alertes.length}</span>
          <span>Depuis votre dernière connexion: {newAlertes}</span>
        </div>

        <div className="alertesList">
          <h2 className="subHeader">Liste des Alertes en Cours</h2>
          <div className="cardContainer">
            <button onClick={handlePrevClick} className="arrowButton">‹</button>
            <div className="cards">
              {visibleAlertes.map((alerte) => (
                <div key={alerte.id} className="card">
                  <div className="cardHeader">
                    <strong>{alerte.type}</strong>
                    <span>{alerte.date}</span>
                  </div>
                  <h3 className="cardTitle">{alerte.titre}</h3>
                  <p className="cardDescription">{alerte.description}</p>
                  <button onClick={() => handleDismiss(alerte.id)} className="dismissButton">Marquer comme traité</button>
                </div>
              ))}
            </div>
            <button onClick={handleNextClick} className="arrowButton">›</button>
          </div>
        </div>

        <div className="suiviAlertes">
          <h2 className="subHeader">Section de Suivi des Alertes</h2>
          {/* Intégration du suivi des alertes ici */}
        </div>

        {showPopup && (
          <div className="popup">
            <div className="popupContent">
              <h2>Résumé des Notifications</h2>
              <button onClick={() => setShowPopup(false)} className="closeButton">Fermer</button>
              <ul className="popupList">
                {alertes.map((alerte) => (
                  <li key={alerte.id} className="popupListItem">
                    <strong>{alerte.type}</strong> - {alerte.titre} ({alerte.date})
                    <p>{alerte.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertesGeneralesScreen;
