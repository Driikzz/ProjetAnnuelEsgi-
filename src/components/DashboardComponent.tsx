import React from 'react';

interface DashboardComponentProps {
  duoStartPeriod: any[];
  duoMiPeriod: any[];
  duoEndPeriod: any[];
}

const DashboardComponent: React.FC<DashboardComponentProps> = ({ duoStartPeriod, duoMiPeriod, duoEndPeriod }) => {
  return (
    <div className='board-container'>
      <h3 className='title-section'>Tableau de bord</h3>
      
      <div className='all-card-board'>
        <div className='card-board-container'>
          <h4>Nombre de RDV de période d'essai restants</h4>
          <p>{duoStartPeriod.length}</p>
        </div>
        <div className='card-board-container'>
          <h4>Nombre de RDV de mi-parcours restants</h4>
          <p>{duoMiPeriod.length}</p>
        </div>
        <div className='card-board-container'>
          <h4>Nombre de RDV finnaux restants</h4>
          <p>{duoEndPeriod.length}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
