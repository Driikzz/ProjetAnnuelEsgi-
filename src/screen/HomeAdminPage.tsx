import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import DuoService from '../services/DuoService';
import DashboardComponent from '../components/DashboardComponent';
import AlternantsListComponent from '../components/AlternantsListComponent';
import AlertesComponent from '../components/AlertesComponent';

const HomeAdminPage: React.FC = () => {
  const [user, setUser] = useState<any>("");
  const [duoStartPeriod, setDuoStartPeriod] = useState<any[]>([]);
  const [duoMiPeriod, setDuoMiPeriod] = useState<any[]>([]);
  const [duoEndPeriod, setDuoEndPeriod] = useState<any[]>([]);
  const [suiveurDuo, setSuiveurDuo] = useState<any[]>([]);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const userResponse = await UserService.getUser(token);
        console.log("User:", userResponse);
        setUser(userResponse);

        const suiveurResponse = await UserService.getDuoWithSuiveurIdAndPeriodMeetingFalse(userResponse.id, token);
        console.log('Data fetched for suiveur:', suiveurResponse);
        setDuoStartPeriod(suiveurResponse.duoTrialPeriod);
        setDuoMiPeriod(suiveurResponse.duoMiPeriod);
        setDuoEndPeriod(suiveurResponse.duoYearPeriod);

        const suiveurAllDuo = await DuoService.getDuosByUserId(userResponse.id, token);
        console.log('All duo fetched for suiveur:', suiveurAllDuo);
        setSuiveurDuo(suiveurAllDuo);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className='container'>
      <div>
        <h3 className='title-screen'>Bienvenue sur EduLink - Simplifiez la gestion de vos stages et alternances.</h3>
      </div>
      <DashboardComponent 
        duoStartPeriod={duoStartPeriod} 
        duoMiPeriod={duoMiPeriod} 
        duoEndPeriod={duoEndPeriod} 
      />
      <AlternantsListComponent 
        alternants={[]} 
        suiveurDuo={suiveurDuo} 
      />
      <AlertesComponent showExtractButton={true} />
    </div>
  );
};

export default HomeAdminPage;
