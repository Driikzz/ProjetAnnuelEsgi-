import React, { useState, useEffect } from 'react';
import DuoService from '../services/DuoService'; // Assurez-vous que le chemin est correct
import IDuos from '../interfaces/IDuos'; // Assurez-vous que le chemin est correct
import './styles/SuiviSuiveur.css'; // Importez le fichier CSS
import UserService from '../services/UserService';

const SuiviSuiveurScreen: React.FC = () => {
  const [detailedDuos, setDetailedDuos] = useState<IDuos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEnterprises, setExpandedEnterprises] = useState<{ [key: string]: boolean }>({});
  const [selectedMeetingType, setSelectedMeetingType] = useState<string | null>(null);
  const [selectedDuo, setSelectedDuo] = useState<IDuos | null>(null);
  const [user, setUser] = useState<any>(null);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchUserWithToken = async () => {
      try {
        const response = await UserService.getUser(token);
        console.log("User:", response);
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    if (token) {
      fetchUserWithToken();
    }
  }, [token]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (user) {
          const duos = await DuoService.getDuosByUserId(user.id, token);
          console.log("Duos:", duos);
          setDetailedDuos(duos);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && token) {
      fetchInitialData();
    }
  }, [user, token]);

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
      detail.enterpriseName.toLowerCase().includes(searchTermLower) ||
      detail.Alternant?.name.toLowerCase().includes(searchTermLower) ||
      detail.Alternant?.lastname.toLowerCase().includes(searchTermLower) ||
      detail.Tuteur?.name.toLowerCase().includes(searchTermLower) ||
      detail.Tuteur?.lastname.toLowerCase().includes(searchTermLower) ||
      detail.Suiveur?.name.toLowerCase().includes(searchTermLower) ||
      detail.Suiveur?.lastname.toLowerCase().includes(searchTermLower)
    );
  });

  const groupedByEnterprise = filteredDuos.reduce((acc, detail) => {
    if (!acc[detail.enterpriseName]) {
      acc[detail.enterpriseName] = [];
    }
    acc[detail.enterpriseName].push(detail);
    return acc;
  }, {} as { [key: string]: IDuos[] });

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
              <h2>{enterpriseName} {expandedEnterprises[enterpriseName] ? '▲' : '▼'}</h2>
            </div>
            {expandedEnterprises[enterpriseName] && (
              <div className="enterprise-details">
                {groupedByEnterprise[enterpriseName].map((detail, idx) => (
                  <div key={idx} className="duo-details">
                    <h3>Enterprise: {detail.enterpriseName}</h3>
                    <p>Alternant: {detail.Alternant?.name} {detail.Alternant?.lastname}</p>
                    <p>Tuteur: {detail.Tuteur?.name} {detail.Tuteur?.lastname}</p>
                    <p>Suiveur: {detail.Suiveur?.name} {detail.Suiveur?.lastname}</p>
                    <div className="meeting-status">
                      <div>
                        <span>Entretient période d'essai: {detail.trialPeriodMeeting ? '✔️' : '❌'}</span>
                        <button className="edit-button" onClick={() => openPopup(detail, 'trialPeriodMeeting')}>Modifier</button>
                      </div>
                      <div>
                        <span>Entretient mi-parcours: {detail.midTermMeeting ? '✔️' : '❌'}</span>
                        <button className="edit-button" onClick={() => openPopup(detail, 'midTermMeeting')}>Modifier</button>
                      </div>
                      <div>
                        <span>Entretien de fin d'année: {detail.yearEndMeeting ? '✔️' : '❌'}</span>
                        <button className="edit-button" onClick={() => openPopup(detail, 'yearEndMeeting')}>Modifier</button>
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
