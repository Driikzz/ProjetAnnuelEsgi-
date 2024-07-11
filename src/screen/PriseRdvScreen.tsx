import React, { useEffect, useState } from 'react';
import '../App.css'; // Chemin relatif correct vers App.css
import rdvService from '../services/RdvService';
import UserService from '../services/UserService';
import { useParams } from 'react-router-dom';
import DuoService from '../services/DuoService';

const PriseRdvScreen: React.FC = () => {
  const token = localStorage.getItem('token') || '';
  const { id: tuteurId } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>("");
  const [duo, setDuo] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [rdvTuteur, setRdvTuteur] = useState<any[]>([]);
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
    const fetchAllUsers = async () => {
      try {
        const response = await UserService.getAllUsers(token);
        setAllUsers(response);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTuteurOrSuiveur = async () => {
      try {
        const response = await UserService.getUserById(tuteurId as any, token);
        console.log("user:", response);
        setUser(response);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDuo = async () => {
      try {
        const response = await DuoService.getDuoByTuorId(tuteurId as any, token);
        console.log('Duo:', response);
        setDuo(response);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRdvByTuteurId = async () => {
      try {
        const response = await rdvService.getRdvByTutorId(tuteurId as any, token);
        setRdvTuteur(response); 
        console.log('Rendez-vous:', response);
      } catch (error) {
        console.error('Error fetching rdv:', error);
      }
    };

    if (token) {
      fetchTuteurOrSuiveur();
      fetchDuo();
      fetchAllUsers();
      fetchRdvByTuteurId();
    }
  }, [token, tuteurId]);

  const filterAlternantUsers = allUsers.filter((user) =>
    duo.some((d) => d.idAlternant === user.id)
  );

  const filterSuiveurUsers = allUsers.filter((user) =>
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
        // Afficher une popup de succès
        window.alert('Le rendez-vous a été pris en compte avec succès!');
        // Réinitialiser le formulaire après la réussite
        setForm({
          dateRdv: '',
          idSuiveur: '',
          idAlternant: '',
          idTuteur: tuteurId,
          formation: '',
          entreprise: form.entreprise // Garder l'entreprise sélectionnée
        });
      } catch (error) {
        console.error(error);
        // Afficher une popup d'erreur
        window.alert('Une erreur est survenue. Le rendez-vous n\'a pas pu être pris.');
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
      {rdvTuteur.length < duo.length ? (
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
              {filterSuiveurUsers.map((d) => (
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
              {filterAlternantUsers.map((d) => (
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
      ) : (
        <div>
          <div>Vous avez déjà pris tous vos rendez-vous</div>
        </div>
      )}
      <div>
        <h2>Rendez-vous déjà pris</h2>
        <div className="card-container">
          {rdvTuteur.map((rdv) => (
            <div className="card" key={rdv.id}>
              <div className="card-content">
                <h3>{rdv.enterpriseName}</h3>
                <p><strong>Alternant:</strong> {rdv.alternant?.name} {rdv.alternant?.lastname} </p>
                <p><strong>Suiveur:</strong> {rdv.suiveur?.name} {rdv.suiveur?.lastname} </p>
                <p><strong>Date:</strong> {rdv.dateRdv}</p>
                <p><strong>Formation:</strong> {rdv.formation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriseRdvScreen;
