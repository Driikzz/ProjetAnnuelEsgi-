import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import DuoService from '../services/DuoService';
import UserService from '../services/UserService';
import StartOfYearMeetingForm from '../components/forms/StartOfYearMeetingForm';
import MidTermMeetingForm from '../components/forms/MidTermMeetingForm';
import EndOfYearMeetingForm from '../components/forms/EndOfYearMeetingForm';
import IDuos from '../interfaces/IDuos';
import MeetingService from '../services/MeetingService'; // Ensure this matches the file name exactly
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
  const [meetingData, setMeetingData] = useState<any>(null);

  const { getItem } = useAsyncStorage('token');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const savedToken = await getItem();
        if (savedToken !== null) {
          setToken(savedToken);
        }
      } catch (error) {
        console.error('Error loading token from AsyncStorage:', error);
      }
    };

    getToken();
  }, [getItem]);

  useEffect(() => {
    const fetchUserWithToken = async () => {
      if (!token) {
        console.error("No token available");
        return;
      }
      try {
        const response = await UserService.getUser(token);
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserWithToken();
  }, [token]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) {
        console.error("No user available");
        return;
      }
      try {
        const duos = await DuoService.getDuosByUserId(user.id, token!);
        setDetailedDuos(duos);
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

  const openForm = async (duo: IDuos, meetingType: string) => {
    setSelectedDuo(duo);
    setSelectedMeetingType(meetingType);
    try {
      let meetingData;
      if (meetingType === 'trialPeriodMeeting') {
        meetingData = await MeetingService.getStartOfYearMeeting(duo.Alternant.id.toString(), token!);
      } else if (meetingType === 'midTermMeeting') {
        meetingData = await MeetingService.getMidTermMeeting(duo.Alternant.id.toString(), token!);
      } else if (meetingType === 'yearEndMeeting') {
        meetingData = await MeetingService.getEndOfYearMeeting(duo.Alternant.id.toString(), token!);
      }
      setMeetingData(meetingData);
      console.log('Fetched meeting data:', meetingData);
    } catch (error) {
      console.error(`Failed to fetch ${meetingType} data:`, error);
    }
  };

  const closeForm = () => {
    setSelectedDuo(null);
    setSelectedMeetingType(null);
    setMeetingData(null);
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
        contentLabel="Meeting Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxHeight: '90vh',
            overflowY: 'auto' // Pour permettre le défilement
          },
        }}
      >
        {selectedMeetingType === 'trialPeriodMeeting' && <StartOfYearMeetingForm duo={selectedDuo!} token={token!} onClose={closeForm} meetingData={meetingData} />}
        {selectedMeetingType === 'midTermMeeting' && <MidTermMeetingForm duo={selectedDuo!} token={token!} onClose={closeForm} meetingData={meetingData} />}
        {selectedMeetingType === 'yearEndMeeting' && <EndOfYearMeetingForm duo={selectedDuo!} token={token!} onClose={closeForm} meetingData={meetingData} />}
      </Modal>
    </div>
  );
};

export default SuiviSuiveurScreen;
