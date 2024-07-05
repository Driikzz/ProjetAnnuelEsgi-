import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DuoService from '../services/DuoService';
import UserService from '../services/UserService';
import StartOfYearMeetingForm from '../components/forms/StartOfYearMeetingForm';
import MidTermMeetingForm from '../components/forms/MidTermMeetingForm';
import EndOfYearMeetingForm from '../components/forms/EndOfYearMeetingForm';
import IDuos from '../interfaces/IDuos';
import './styles/SuiviSuiveur.css';

Modal.setAppElement('#root');  // Assurez-vous que cet élément correspond à l'ID de l'élément racine de votre application

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

  const openForm = (duo: IDuos, meetingType: string) => {
    setSelectedDuo(duo);
    setSelectedMeetingType(meetingType);
  };

  const closeForm = () => {
    setSelectedDuo(null);
    setSelectedMeetingType(null);
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
    return <div>Loading...</div>;
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
                        <button className="edit-button" onClick={() => openForm(detail, 'trialPeriodMeeting')}>Modifier</button>
                      </div>
                      <div>
                        <span>Entretient mi-parcours: {detail.midTermMeeting ? '✔️' : '❌'}</span>
                        <button className="edit-button" onClick={() => openForm(detail, 'midTermMeeting')}>Modifier</button>
                      </div>
                      <div>
                        <span>Entretien de fin d'année: {detail.yearEndMeeting ? '✔️' : '❌'}</span>
                        <button className="edit-button" onClick={() => openForm(detail, 'yearEndMeeting')}>Modifier</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedMeetingType && !!selectedDuo}
        onRequestClose={closeForm}
        className="modal"
        overlayClassName="overlay"
      >
        {selectedMeetingType === 'trialPeriodMeeting' && <StartOfYearMeetingForm duo={selectedDuo!} onClose={closeForm} />}
        {selectedMeetingType === 'midTermMeeting' && <MidTermMeetingForm duo={selectedDuo!} onClose={closeForm} />}
        {selectedMeetingType === 'yearEndMeeting' && <EndOfYearMeetingForm duo={selectedDuo!} onClose={closeForm} />}
      </Modal>
    </div>
  );
};

export default SuiviSuiveurScreen;
