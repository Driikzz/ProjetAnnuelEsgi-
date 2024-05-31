import React, { useState } from 'react';

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
    <div style={styles.container}>
      <div>
        <h1 style={styles.header}>Tableau de Bord des Alertes</h1>

        <div style={styles.notificationSummary} onClick={() => setShowPopup(true)}>
          <span>Notifications: {alertes.length}</span>
          <span>Depuis votre dernière connexion: {newAlertes}</span>
        </div>

        <div style={styles.alertesList}>
          <h2 style={styles.subHeader}>Liste des Alertes en Cours</h2>
          <div style={styles.cardContainer}>
            <button onClick={handlePrevClick} style={styles.arrowButton}>‹</button>
            <div style={styles.cards}>
              {visibleAlertes.map((alerte) => (
                <div key={alerte.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <strong>{alerte.type}</strong>
                    <span>{alerte.date}</span>
                  </div>
                  <h3 style={styles.cardTitle}>{alerte.titre}</h3>
                  <p style={styles.cardDescription}>{alerte.description}</p>
                  <button onClick={() => handleDismiss(alerte.id)} style={styles.dismissButton}>Marquer comme traité</button>
                </div>
              ))}
            </div>
            <button onClick={handleNextClick} style={styles.arrowButton}>›</button>
          </div>
        </div>

        <div style={styles.suiviAlertes}>
          <h2 style={styles.subHeader}>Section de Suivi des Alertes</h2>
          {/* Intégration du suivi des alertes ici */}
        </div>

        {showPopup && (
          <div style={styles.popup}>
            <div style={styles.popupContent}>
              <h2>Résumé des Notifications</h2>
              <button onClick={() => setShowPopup(false)} style={styles.closeButton}>Fermer</button>
              <ul style={styles.popupList}>
                {alertes.map((alerte) => (
                  <li key={alerte.id} style={styles.popupListItem}>
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

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    position: "relative",
    marginTop:80,
  },
  header: {
    textAlign: 'center' as 'center',
    marginBottom: '20px',
    fontSize: '24px',
  },
  notificationSummary: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  subHeader: {
    textAlign: 'center' as 'center',
    marginBottom: '20px',
    fontSize: '20px',
  },
  alertesList: {},
  cardContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '10px',
    fontSize: '20px',
    margin: '0 10px',
  },
  cards: {
    display: 'flex',
    gap: '20px',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '300px',
    textAlign: 'center' as 'center',
    position: 'relative',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '18px',
    margin: '10px 0',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#555',
  },
  dismissButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  suiviAlertes: {
    marginTop: '40px',
  },
  popup: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
   popupContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    maxHeight: '80%', // Ajouté
    overflowY: 'auto', // Ajouté
  },
  closeButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  popupList: {
    listStyleType: 'none',
    padding: 0,
  },
  popupListItem: {
    marginBottom: '10px',
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
};

export default AlertesGeneralesScreen;
