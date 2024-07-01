import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService'; // Assurez-vous que le chemin est correct
import DuoService from '../services/DuoService'; // Assurez-vous que le chemin est correct
import IDuos from '../interfaces/IDuos'; // Assurez-vous que le chemin est correct
import IUsers from '../interfaces/IUsers'; // Assurez-vous que le chemin est correct
import './styles/SuiviSuiveur.css'; // Importez le fichier CSS

interface DetailedDuo {
  duo: IDuos;
  alternant: IUsers | undefined;
  tuteur: IUsers | undefined;
  suiveur: IUsers | undefined;
}

const SuiviSuiveurScreen: React.FC = () => {
  const [detailedDuos, setDetailedDuos] = useState<DetailedDuo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEnterprises, setExpandedEnterprises] = useState<{ [key: string]: boolean }>({});
  const [selectedMeetingType, setSelectedMeetingType] = useState<string | null>(null);
  const [selectedDuo, setSelectedDuo] = useState<IDuos | null>(null);

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

  const openPopup = (duo: IDuos, meetingType: string) => {
    setSelectedDuo(duo);
    setSelectedMeetingType(meetingType);
  };

  const closePopup = () => {
    setSelectedDuo(null);
    setSelectedMeetingType(null);
  };

  const handleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour gérer la soumission des réunions
    closePopup();
  };

  const toggleEnterprise = (enterpriseName: string) => {
    setExpandedEnterprises({
      ...expandedEnterprises,
      [enterpriseName]: !expandedEnterprises[enterpriseName],
    });
  };

  const filteredDuos = detailedDuos.filter(detail => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      detail.duo.enterpriseName.toLowerCase().includes(searchTermLower) ||
      detail.alternant?.name.toLowerCase().includes(searchTermLower) ||
      detail.alternant?.lastname.toLowerCase().includes(searchTermLower) ||
      detail.tuteur?.name.toLowerCase().includes(searchTermLower) ||
      detail.tuteur?.lastname.toLowerCase().includes(searchTermLower) ||
      detail.suiveur?.name.toLowerCase().includes(searchTermLower) ||
      detail.suiveur?.lastname.toLowerCase().includes(searchTermLower)
    );
  });

  const groupedByEnterprise = filteredDuos.reduce((acc, detail) => {
    if (!acc[detail.duo.enterpriseName]) {
      acc[detail.duo.enterpriseName] = [];
    }
    acc[detail.duo.enterpriseName].push(detail);
    return acc;
  }, {} as { [key: string]: DetailedDuo[] });

  if (isLoading) {
    return <div>Loading...</div>; // Optionnellement améliorer la présentation de l'état de chargement
  }

  return (
    <div className="container">
      <h1>Suivi des duos</h1>
      <input
        type="text"
        placeholder="Rechercher par nom ou entreprise"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="duo-list">
        {Object.keys(groupedByEnterprise).map((enterpriseName, index) => (
          <div key={index} className={`enterprise-section ${expandedEnterprises[enterpriseName] ? 'expanded' : ''}`}>
            <div
              className="enterprise-header"
              onClick={() => toggleEnterprise(enterpriseName)}
            >
              <h2>{groupedByEnterprise[enterpriseName][0].alternant?.name} {groupedByEnterprise[enterpriseName][0].alternant?.lastname} {expandedEnterprises[enterpriseName] ? '▲' : '▼'}</h2>
            </div>
            {expandedEnterprises[enterpriseName] && (
              <div className="enterprise-details">
                {groupedByEnterprise[enterpriseName].map((detail, idx) => (
                  <div key={idx} className="duo-details">
                    <h3>Enterprise: {detail.duo.enterpriseName}</h3>
                    <p>Alternant: {detail.alternant?.name} {detail.alternant?.lastname}</p>
                    <p>Tuteur: {detail.tuteur?.name} {detail.tuteur?.lastname}</p>
                    <p>Suiveur: {detail.suiveur?.name} {detail.suiveur?.lastname}</p>
                    <div className="meeting-status">
                      <div>
                        <span>Entretient periode d'essaie: {detail.duo.trialPeriodMeeting ? '✔️' : '❌'}</span>
                        <button className="edit-button" onClick={() => openPopup(detail.duo, 'trialPeriodMeeting')}>Modifier</button>
                      </div>
                      <div>
                        <span>Entretient mi-parcour: {detail.duo.midTermMeeting ? '✔️' : '❌'}</span>
                        <button className="edit-button" onClick={() => openPopup(detail.duo, 'midTermMeeting')}>Modifier</button>
                      </div>
                      <div>
                        <span>Enterient de fin d'année: {detail.duo.yearEndMeeting ? '✔️' : '❌'}</span>
                        <button className="edit-button" onClick={() => openPopup(detail.duo, 'yearEndMeeting')}>Modifier</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedMeetingType && selectedDuo && (
        <div className="popup">
          <div className="popup-inner">
            <h2>{selectedMeetingType.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <form onSubmit={handleMeetingSubmit}>
              <label>
                Status:
                <select>
                  <option value="true">Completed</option>
                  <option value="false">Not Completed</option>
                </select>
              </label>
              <div className="popup-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={closePopup}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuiviSuiveurScreen;
