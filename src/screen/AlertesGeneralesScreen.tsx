import React, { useState, useEffect } from 'react';
import './styles/AlertesGeneralesScreen.css';

interface Notification {
  ID_Notification: number;
  Message: string;
  DateEnvoi: string;
  ID_Alternant: number;
  ID_Suiveur: number;
  ID_Tuteur: number;
}

interface Person {
  ID: number;
  Name: string;
}

const fetchNotifications = async (): Promise<Notification[]> => {
  return [
    { ID_Notification: 1, Message: 'Intention de poursuivre les études', DateEnvoi: '2024-05-20', ID_Alternant: 1, ID_Suiveur: 2, ID_Tuteur: 3 },
    { ID_Notification: 2, Message: 'Recrutement par Entreprise X', DateEnvoi: '2024-05-22', ID_Alternant: 4, ID_Suiveur: 5, ID_Tuteur: 6 },
    { ID_Notification: 3, Message: 'Offre de stage', DateEnvoi: '2024-05-23', ID_Alternant: 7, ID_Suiveur: 8, ID_Tuteur: 9 },
    // Add more notifications as needed
  ];
};

const fetchAlternants = async (): Promise<Person[]> => {
  return [
    { ID: 1, Name: 'John Doe' },
    { ID: 4, Name: 'Alice Johnson' },
    { ID: 7, Name: 'Robert Brown' },
    // Add more alternants as needed
  ];
};

const fetchSuiveurs = async (): Promise<Person[]> => {
  return [
    { ID: 2, Name: 'Jane Smith' },
    { ID: 5, Name: 'Michael White' },
    { ID: 8, Name: 'Emily Davis' },
    // Add more suiveurs as needed
  ];
};

const fetchTuteurs = async (): Promise<Person[]> => {
  return [
    { ID: 3, Name: 'Paul Green' },
    { ID: 6, Name: 'Laura Black' },
    { ID: 9, Name: 'William Red' },
    // Add more tuteurs as needed
  ];
};

const AlertesGeneralesScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [treatedNotifications, setTreatedNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [alternants, setAlternants] = useState<Person[]>([]);
  const [suiveurs, setSuiveurs] = useState<Person[]>([]);
  const [tuteurs, setTuteurs] = useState<Person[]>([]);
  const [newNotifications, setNewNotifications] = useState(2); // Example of new notifications since last login

  useEffect(() => {
    const loadNotifications = async () => {
      const fetchedNotifications = await fetchNotifications();
      setNotifications(fetchedNotifications);
    };

    const loadPersons = async () => {
      const fetchedAlternants = await fetchAlternants();
      const fetchedSuiveurs = await fetchSuiveurs();
      const fetchedTuteurs = await fetchTuteurs();
      setAlternants(fetchedAlternants);
      setSuiveurs(fetchedSuiveurs);
      setTuteurs(fetchedTuteurs);
    };

    loadNotifications();
    loadPersons();
  }, []);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? notifications.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === notifications.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDismiss = (id: number) => {
    const dismissedNotification = notifications.find((notification) => notification.ID_Notification === id);
    if (dismissedNotification) {
      setNotifications(notifications.filter((notification) => notification.ID_Notification !== id));
      setTreatedNotifications([...treatedNotifications, dismissedNotification]);
    }
  };

  const handleShowDetails = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseDetails = () => {
    setSelectedNotification(null);
  };

  const getPersonName = (id: number, persons: Person[]) => {
    const person = persons.find((p) => p.ID === id);
    return person ? person.Name : 'Unknown';
  };

  const visibleNotifications = notifications.slice(currentIndex, currentIndex + 3).concat(notifications.slice(0, Math.max(0, currentIndex + 3 - notifications.length)));
  const allNotifications = [...notifications, ...treatedNotifications];

  return (
    <div className="container">
      <div>
        <h1 className="header">Tableau de Bord des Alertes</h1>

        <div className="notificationSummary" onClick={() => setShowPopup(true)}>
          <span>Notifications: {notifications.length}</span>
          <span>Depuis votre dernière connexion: {newNotifications}</span>
        </div>

        <div className="alertesList">
          <h2 className="subHeader">Liste des Alertes en Cours</h2>
          <div className="cardContainer">
            <button onClick={handlePrevClick} className="arrowButton">‹</button>
            <div className="cards">
              {visibleNotifications.map((notification) => (
                <div key={notification.ID_Notification} className="card">
                  <div className="cardHeader">
                    <strong>{getPersonName(notification.ID_Alternant, alternants)}</strong>
                    <span>{notification.DateEnvoi}</span>
                  </div>
                  <h3 className="cardTitle">{notification.Message}</h3>
                  <button onClick={() => handleShowDetails(notification)} className="detailsButton">Plus d'info</button>
                  <button onClick={() => handleDismiss(notification.ID_Notification)} className="dismissButton">Marquer comme traité</button>
                </div>
              ))}
            </div>
            <button onClick={handleNextClick} className="arrowButton">›</button>
          </div>
        </div>

        <div className="treatedAlertes">
          <h2 className="subHeader">Alertes Traitées</h2>
          <div className="treatedContainer">
            {treatedNotifications.map((notification) => (
              <div key={notification.ID_Notification} className="card treatedCard">
                <div className="cardHeader">
                  <strong>{getPersonName(notification.ID_Alternant, alternants)}</strong>
                  <span>{notification.DateEnvoi}</span>
                </div>
                <h3 className="cardTitle">{notification.Message}</h3>
                <button onClick={() => handleShowDetails(notification)} className="detailsButton">Plus d'info</button>
              </div>
            ))}
          </div>
        </div>

        {showPopup && (
          <div className="popup">
            <div className="popupContent">
              <h2>Résumé des Notifications</h2>
              <button onClick={() => setShowPopup(false)} className="closeButton">Fermer</button>
              <ul className="popupList">
                {notifications.map((notification) => (
                  <li key={notification.ID_Notification} className="popupListItem">
                    <strong>{getPersonName(notification.ID_Alternant, alternants)}</strong> - {notification.Message} ({notification.DateEnvoi})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {selectedNotification && (
          <div className="detailsPopup">
            <div className="detailsContent">
              <h2>Détails de l'Alerte</h2>
              <button onClick={handleCloseDetails} className="closeButton">Fermer</button>
              <div>
                <strong>Alternant: </strong>{getPersonName(selectedNotification.ID_Alternant, alternants)}
              </div>
              <div>
                <strong>Suiveur: </strong>{getPersonName(selectedNotification.ID_Suiveur, suiveurs)}
              </div>
              <div>
                <strong>Tuteur: </strong>{getPersonName(selectedNotification.ID_Tuteur, tuteurs)}
              </div>
              <div>
                <strong>Message: </strong>{selectedNotification.Message}
              </div>
              <div>
                <strong>Date d'envoi: </strong>{selectedNotification.DateEnvoi}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertesGeneralesScreen;
