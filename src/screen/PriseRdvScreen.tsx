import React, { useEffect, useState } from 'react';
import '../App.css'; // Chemin relatif correct vers App.css
import rdvService from '../services/RdvService';
import UserService from '../services/UserService';
import { useParams } from 'react-router-dom';
import DuoService from '../services/DuoService';
import { all } from 'axios';

const PriseRdvScreen: React.FC = () => {
  const token = localStorage.getItem('token') || '';
  const tuteurId = useParams<{ id: any }>().id;
  const [user, setUser] = useState<any>("");
  const [duo, setDuo] = useState<any[]>([]);
  const [allusers, setAllusers] = useState<any[]>([]);
  const [form, setForm] = useState({
    dateRdv: '',
    idSuiveur: '',
    idAlternant: '',
    idTuteur: tuteurId,
    formation: '',
    entreprise: ''
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await UserService.getAllUsers(token);
        setAllusers(response);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchTuteurorSuiveur = async () => {
      try {
        const response = await UserService.getUserById(tuteurId, token);
        console.log("user:", response);
        setUser(response);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDuo = async () => {
      try {
        const response = await DuoService.getDuoByTuorId(tuteurId, token);
        console.log('Duo:', response);
        setDuo(response);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchTuteurorSuiveur();
      fetchDuo();
      getAllUsers();
    }
  }, [token, tuteurId]);

  
  const filterAlternantUsers = allusers.filter((user) =>
  duo.some((d) => d.idAlternant === user.id)
);

  const  filterSuiveurUsers = allusers.filter((user) =>
    duo.some((d) => d.idSuiveur === user.id)
  );

 

  useEffect(() => {
    if (duo.length > 0) {
      setForm((prevForm) => ({
        ...prevForm,
        entreprise: duo[0]?.enterpriseName || '',
      }));
    }
  }, [duo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createRdv = async () => {
    if (token) {
      try {
        const response = await rdvService.createRdv(form, token);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const datetime = new Date(form.dateRdv);
    const day = datetime.getDay();
    const hours = datetime.getHours();

    if (day === 0 || day === 6) {
      setError('Les rendez-vous ne peuvent pas être pris le samedi ou le dimanche.');
      return;
    }

    if (hours < 8 || hours >= 17) {
      setError('Les rendez-vous ne peuvent être pris qu\'entre 08:00 et 17:00.');
      return;
    }

    setError('');
    createRdv();
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 16);
    return date;
  };

  const currentDateTime = getCurrentDateTime();

  return (
    <div className="container">
      <h1>Prise de RDV - Période d'Essai</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dateRdv">Date et Heure :</label>
          <input
            type="datetime-local"
            id="dateRdv"
            name="dateRdv"
            value={form.dateRdv}
            onChange={handleChange}
            min={currentDateTime}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label htmlFor="suiveur">Suiveur :</label>
          <select id="idSuiveur" name="idSuiveur" value={form.idSuiveur} onChange={handleChange}>
            <option value="">Sélectionner</option>
            {filterSuiveurUsers.map(d => (
              <option key={d.id} value={d.id}>
                {d.name + ' ' + d.lastname}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="alternant">Alternant :</label>
          <select id="idAlternant" name="idAlternant" value={form.idAlternant} onChange={handleChange}>
            <option value="">Sélectionner</option>
            {filterAlternantUsers.map(d => (
              <option key={d.id} value={d.id}>
                 {d.name + ' ' + d.lastname}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="nom">Nom :</label>
          <input type="text" id="idTuteur" name="idTuteur" value={form.idTuteur} onChange={handleChange} placeholder={user.lastname} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="formation">Formation :</label>
          <input type="text" id="formation" name="formation" value={form.formation} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="entreprise">Entreprise :</label>
          <input type="text" id="entreprise" name="entreprise" value={form.entreprise} onChange={handleChange} readOnly />
        </div>
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default PriseRdvScreen;
