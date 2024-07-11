import React, { useState, useEffect } from 'react';
import AlertesService from '../services/alertesService';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import ExtractService from '../services/Extract'; // Assurez-vous que le chemin vers ExtractService est correct

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
  dateDeTraitement?: string;
}

interface Person {
  id: number;
  name: string;
  lastname: string;
}

interface AlertesComponentProps {
  showExtractButton?: boolean;
}

const AlertesComponent: React.FC<AlertesComponentProps> = ({ showExtractButton }) => {
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [treatedAlerts, setTreatedAlerts] = useState<Notification[]>([]);
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
    const loadAlerts = async () => {
      if (token) {
        try {
          const fetchedAlerts = await AlertesService.getAllAlertes(token);
          const untreatedAlerts = fetchedAlerts.filter((alert: Notification) => !alert.dateDeTraitement);
          const treatedAlerts = fetchedAlerts.filter((alert: Notification) => alert.dateDeTraitement);

          setAlerts(untreatedAlerts);
          setTreatedAlerts(treatedAlerts);
        } catch (error) {
          console.error('Erreur lors du chargement des alertes:', error);
        }
      }
    };

    loadAlerts();
  }, [token]);

  const getPersonName = (person: Person | null) => {
    return person ? `${person.name} ${person.lastname}` : 'Inconnu';
  };

  const getAlertMessage = (alert: Notification) => {
    switch (alert.typeAlerte) {
      case 'RECRUITMENT_PLANS_ALERT':
        return `L'alternant ${getPersonName(alert.alternant)} a des plans de recrutement.`;
      case 'CONTINUATION_OF_STUDIES_ALERT':
        return `L'alternant ${getPersonName(alert.alternant)} prévoit de continuer ses études.`;
      case 'PROACTIVITY_ALERT':
        return `L'alternant ${getPersonName(alert.alternant)} a un score de proactivité bas.`;
      case 'TEAMWORK_ALERT':
        return `L'alternant ${getPersonName(alert.alternant)} a un score de travail d'équipe bas.`;
      case 'START_OF_YEAR':
        return `L'année de l'alternant ${getPersonName(alert.alternant)} a bien commencé.`;
      case 'MID_TERM':
        return `L'évaluation de mi-parcours de l'alternant ${getPersonName(alert.alternant)} est en cours.`;
      case 'END_OF_YEAR':
        return `L'année de l'alternant ${getPersonName(alert.alternant)} est terminée.`;
      default:
        return alert.message;
    }
  };

  const extractData = async () => {
    const response: any = await ExtractService.extractData(token);
    console.log(response);

    if (response instanceof Response) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.xlsx';
      a.click();
    } else {
      console.error("Le type de response n'est pas Response");
    }
  };

  return (
    <div className='container'>
      <div>
        <h3 className='title-screen'>Alertes</h3>
      </div>
      <div className='recent-alerts'>
        <h3 className='title-section'>Alertes Récentes</h3>
        <div className='alertes-container'>
          <div className='alerts'>
            <h4>Alertes créées</h4>
            <ul>
              {alerts.map((alert, index) => (
                <li key={index} className='card'>
                  <div className='cardHeader'>
                    <strong>{getPersonName(alert.alternant)}</strong>
                    <span>{new Date(alert.datedeCreation).toLocaleDateString()}</span>
                  </div>
                  <p>{getAlertMessage(alert)}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className='alerts'>
            <h4>Alertes traitées</h4>
            <ul>
              {treatedAlerts.map((alert, index) => (
                <li key={index} className='card'>
                  <div className='cardHeader'>
                    <strong>{getPersonName(alert.alternant)}</strong>
                    <span>{new Date(alert.datedeCreation).toLocaleDateString()}</span>
                  </div>
                  <p>{getAlertMessage(alert)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {showExtractButton && (
        <button onClick={extractData}>Extract data</button>
      )}
    </div>
  );
};

export default AlertesComponent;
