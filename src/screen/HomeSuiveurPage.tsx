import React, { useState } from 'react';
import './styles/HomePage.css'; // Make sure to create and include the necessary CSS

interface Alternant {
  id: number;
  name: string;
  status: string;
  trialMeeting: boolean;
  midTermMeeting: boolean;
  yearEndReview: boolean;
}

interface Alerte {
  type: string;
  message: string;
  dateCreation: string;
  idCreateur: number;
}

const HomeSuiveurPage: React.FC = () => {
  const [alternants, setAlternants] = useState<Alternant[]>([
    { id: 1, name: 'Jean Dupont', status: 'En attente', trialMeeting: true, midTermMeeting: false, yearEndReview: false },
    { id: 2, name: 'Marie Durand', status: 'Validé', trialMeeting: true, midTermMeeting: true, yearEndReview: false },
    // Add more alternants as needed
  ]);

  const [alerts, setAlerts] = useState<Alerte[]>([
    { type: 'Problème d\'intégration', message: 'Détails...', dateCreation: '2024-05-20', idCreateur: 1 },
    { type: 'Problème de tâche', message: 'Détails...', dateCreation: '2024-05-22', idCreateur: 2 },
    // Add more alerts as needed
  ]);

  const [treatedAlerts, setTreatedAlerts] = useState<Alerte[]>([
    { type: 'Problème résolu', message: 'Détails...', dateCreation: '2024-06-01', idCreateur: 1 },
    // Add more treated alerts as needed
  ]);

  const totalStages = alternants.length;
  const pendingStages = alternants.filter(a => a.status === 'En attente').length;
  const validatedStages = alternants.filter(a => a.status === 'Validé').length;

  const trialMeetingsRemaining = alternants.filter(a => !a.trialMeeting).length;
  const midTermMeetingsRemaining = alternants.filter(a => !a.midTermMeeting).length;
  const yearEndReviewsRemaining = alternants.filter(a => !a.yearEndReview).length;

  const getNextPhasePeriod = (phase: string) => {
    const currentDate = new Date();
    let approximatePeriod = '';

    switch (phase) {
      case 'trial':
        approximatePeriod = new Date(currentDate.setMonth(currentDate.getMonth() + 1)).toLocaleDateString();
        break;
      case 'midTerm':
        approximatePeriod = new Date(currentDate.setMonth(currentDate.getMonth() + 3)).toLocaleDateString();
        break;
      case 'yearEnd':
        approximatePeriod = new Date(currentDate.setMonth(currentDate.getMonth() + 6)).toLocaleDateString();
        break;
      default:
        approximatePeriod = 'N/A';
    }

    return approximatePeriod;
  };

  return (
    <div className='container'>
      <div>
        <h3 className='title-screen'>Bienvenue sur EduLink - Simplifiez la gestion de vos stages et alternances.</h3>
      </div>
      <div className='board-container'>
        <h3 className='title-section'>Tableau de bord</h3>
        
        <div className='all-card-board'>
          <div className='card-board-container'>
            <h4>Nombre de RDV de période d'essai restants</h4>
            <p>{trialMeetingsRemaining}</p>
            <p>Approx. début: {getNextPhasePeriod('trial')}</p>
          </div>
          <div className='card-board-container'>
            <h4>Nombre de RDV de mi-parcours restants</h4>
            <p>{midTermMeetingsRemaining}</p>
            <p>Approx. début: {getNextPhasePeriod('midTerm')}</p>
          </div>
          <div className='card-board-container'>
            <h4>Nombre de comptes rendus de fin d'année restants</h4>
            <p>{yearEndReviewsRemaining}</p>
            <p>Approx. début: {getNextPhasePeriod('yearEnd')}</p>
          </div>
        </div>

        <div className='liste-alternant'>
          <div className='title-alternance'>
            <h3>Liste des alternants</h3>
          </div>
          <div className='all-alternant-liste'>
            {alternants.map(alternant => (
              <div key={alternant.id} className='alternant-item-container'>
                <div className='alternant-item'>
                  <h4>{alternant.name}</h4>
                  <p>Status: {alternant.status}</p>
                  <p>Trial Period Meeting: {alternant.trialMeeting ? '✔️' : '❌'}</p>
                  <p>Mid-Term Meeting: {alternant.midTermMeeting ? '✔️' : '❌'}</p>
                  <p>Year-End Review: {alternant.yearEndReview ? '✔️' : '❌'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='recent-alerts'>
          <h3 className='title-section'>Alertes Récentes</h3>
          <div className='alertes-container'>
            <div className='alerts'>
              <h4>Alertes créées</h4>
              <ul>
                {alerts.map((alerte, index) => (
                  <li key={index} className='card'>
                    <div className='cardHeader'>
                      <strong>{alerte.type}</strong>
                      <span>{alerte.dateCreation}</span>
                    </div>
                    <p>{alerte.message}</p>
                    <p><strong>ID Createur:</strong> {alerte.idCreateur}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className='alerts'>
              <h4>Alertes traitées</h4>
              <ul>
                {treatedAlerts.map((alerte, index) => (
                  <li key={index} className='card'>
                    <div className='cardHeader'>
                      <strong>{alerte.type}</strong>
                      <span>{alerte.dateCreation}</span>
                    </div>
                    <p>{alerte.message}</p>
                    <p><strong>ID Createur:</strong> {alerte.idCreateur}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSuiveurPage;
