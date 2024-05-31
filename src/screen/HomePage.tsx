import React from 'react';

const HomePage: React.FC = () => {
    
    return (
        <div className='container'>
            <div>
                <h3 className='title-screen'>Bienvenue sur EduLink - Simplifiez la gestion de vos stages et alternances.</h3>
            </div>
            <div className='board-container'>
                <h3 className='title-section'>Tableau de bord</h3>
                
                <div className='all-card-board'>
                    <div className='card-board-container'>
                        <h4>Nombre total de stages et alternances</h4>
                        <p>16</p>
                    </div>
                    <div className='card-board-container'>
                        <h4>Nombre de candidatures en attente</h4>
                        <p>12</p>
                    </div>
                    <div className='card-board-container'>
                        <h4>Nombre de stages validés</h4>
                        <p>15</p>
                    </div>
                </div>

                <div className='Liste alternant'>
                    <div className='title-alternance'>
                        <h3>Liste des alternants</h3>
                    </div>
                    <div className='all-alternant-liste'>
                        
                        <div className='alternant-item-container'>
                            <div className='alternant-item'>
                                <h4>Alternant 1</h4>
                                <p>Stage</p>
                            </div>
                            <div className='status-alternant'>
                                <p>En attente</p>
                            </div>
                        </div>
                        <div className='alternant-item-container'>
                            <div className='alternant-item'>
                                <h4>Alternant 1</h4>
                                <p>Stage</p>
                            </div>
                            <div className='status-alternant'>
                                <p>En attente</p>
                            </div>
                        </div>
                        <div className='alternant-item-container'>
                            <div className='alternant-item'>
                                <h4>Alternant 1</h4>
                                <p>Stage</p>
                            </div>
                            <div className='status-alternant'>
                                <p>En attente</p>
                            </div>
                        </div>
                        <div className='alternant-item-container'>
                            <div className='alternant-item'>
                                <h4>Alternant 1</h4>
                                <p>Stage</p>
                            </div>
                            <div className='status-alternant'>
                                <p>En attente</p>
                            </div>
                        </div>

                    </div>

                </div>
                

            </div>

        </div>
    );
};

export default HomePage;