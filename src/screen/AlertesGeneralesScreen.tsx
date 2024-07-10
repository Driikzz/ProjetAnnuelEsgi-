import React, { useState, useEffect } from 'react';
import './styles/AlertesGeneralesScreen.css';
import AlertesService from '../services/alertesService';
import DuoService from '../services/DuoService';
import UserService from '../services/UserService';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

interface Notification {
  id: number;
  message: string;
  datedeCreation: string;
  alternantId: number;
  duoId: number;
  traitantId: number;
  typeAlerte: string;
  alternant: Person | null;
  suiveur: Person | null;
  tuteur: Person | null;
}

interface Person {
  id: number;
  name: string;
  lastname: string;
}

const AlertesGeneralesScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [treatedNotifications, setTreatedNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [newNotifications, setNewNotifications] = useState(2); // Example of new notifications since last login
  const { getItem } = useAsyncStorage('token');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await getItem();
      if (savedToken) {
        setToken(savedToken);
      }
    };
    fetchToken();
  }, [getItem]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (token) {
        const fetchedNotifications = await AlertesService.getAllAlertes(token);
        for (let notification of fetchedNotifications) {
          const duo = await DuoService.getDuoById(notification.duoId, token);
          if (duo) {
            notification.alternant = await UserService.getUserById(duo.idAlternant, token);
            notification.suiveur = await UserService.getUserById(duo.idSuiveur, token);
            notification.tuteur = await UserService.getUserById(duo.idTuteur, token);
          }
        }
        setNotifications(fetchedNotifications);
      }
    };

    loadNotifications();
  }, [token]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? notifications.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === notifications.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDismiss = (id: number) => {
    const dismissedNotification = notifications.find((notification) => notification.id === id);
    if (dismissedNotification) {
      setNotifications(notifications.filter((notification) => notification.id !== id));
      setTreatedNotifications([...treatedNotifications, dismissedNotification]);
    }
  };

  const handleShowDetails = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseDetails = () => {
    setSelectedNotification(null);
  };

  const getPersonName = (person: Person | null) => {
    return person ? `${person.name} ${person.lastname}` : 'Inconnu';
  };

  const getAlertMessage = (notification: Notification) => {
    switch (notification.typeAlerte) {
      case 'RECRUITMENT_PLANS_ALERT':
        return `L'alternant ${getPersonName(notification.alternant)} a des plans de recrutement.`;
      case 'CONTINUATION_OF_STUDIES_ALERT':
        return `L'alternant ${getPersonName(notification.alternant)} prévoit de continuer ses études.`;
      case 'PROACTIVITY_ALERT':
        return `L'alternant ${getPersonName(notification.alternant)} a un score de proactivité bas.`;
      case 'TEAMWORK_ALERT':
        return `L'alternant ${getPersonName(notification.alternant)} a un score de travail d'équipe bas.`;
      case 'START_OF_YEAR':
        return `L'année de l'alternant ${getPersonName(notification.alternant)} a bien commencé.`;
      case 'MID_TERM':
        return `L'évaluation de mi-parcours de l'alternant ${getPersonName(notification.alternant)} est en cours.`;
      case 'END_OF_YEAR':
        return `L'année de l'alternant ${getPersonName(notification.alternant)} est terminée.`;
      default:
        return notification.message;
    }
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
                <div key={notification.id} className="card">
                  <div className="cardHeader">
                    <strong>{getPersonName(notification.alternant)}</strong>
                    <span>{new Date(notification.datedeCreation).toLocaleDateString()}</span>
                  </div>
                  <h3 className="cardTitle">{getAlertMessage(notification)}</h3>
                  <button onClick={() => handleShowDetails(notification)} className="detailsButton">Plus d'info</button>
                  <button onClick={() => handleDismiss(notification.id)} className="dismissButton">Marquer comme traité</button>
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
              <div key={notification.id} className="card treatedCard">
                <div className="cardHeader">
                  <strong>{getPersonName(notification.alternant)}</strong>
                  <span>{new Date(notification.datedeCreation).toLocaleDateString()}</span>
                </div>
                <h3 className="cardTitle">{getAlertMessage(notification)}</h3>
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
                  <li key={notification.id} className="popupListItem">
                    <strong>{getPersonName(notification.alternant)}</strong> - {getAlertMessage(notification)} ({new Date(notification.datedeCreation).toLocaleDateString()})
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
                <strong>Alternant: </strong>{getPersonName(selectedNotification.alternant)}
              </div>
              <div>
                <strong>Suiveur: </strong>{getPersonName(selectedNotification.suiveur)}
              </div>
              <div>
                <strong>Tuteur: </strong>{getPersonName(selectedNotification.tuteur)}
              </div>
              <div>
                <strong>Message: </strong>{getAlertMessage(selectedNotification)}
              </div>
              <div>
                <strong>Date d'envoi: </strong>{new Date(selectedNotification.datedeCreation).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertesGeneralesScreen;
