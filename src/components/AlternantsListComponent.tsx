import React from 'react';

interface Alternant {
  id: number;
  name: string;
  status: string;
  trialMeeting: boolean;
  midTermMeeting: boolean;
  yearEndReview: boolean;
}

interface AlternantsListComponentProps {
  alternants: Alternant[];
  suiveurDuo: any[];
}

const AlternantsListComponent: React.FC<AlternantsListComponentProps> = ({ alternants, suiveurDuo }) => {
  return (
    <div className='liste-alternant'>
      <div className='title-alternance'>
        <h3>Liste des alternants</h3>
      </div>
      <div className='all-alternant-liste'>
        {suiveurDuo && suiveurDuo.map((suiveur:any) => (
          <div key={suiveur.id} className='alternant-item-container'>
            <div className='alternant-item'>
              <h4>{suiveur.Alternant.name}</h4>
              <p>Status: {(suiveur.trialPeriodMeeting && suiveur.midTermMeeting && suiveur.yearEndMeeting) ? 'terminée' : 'en cours'}</p>
              <p>Trial Period Meeting: {suiveur.trialPeriodMeeting ? '✔️' : '❌'}</p>
              <p>Mid-Term Meeting: {suiveur.midTermMeeting ? '✔️' : '❌'}</p>
              <p>Year-End Review: {suiveur.yearEndMeeting ? '✔️' : '❌'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlternantsListComponent;
