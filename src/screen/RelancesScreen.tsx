import React, { useState } from 'react';
import '../App.css'; // Assurez-vous que le chemin est correct

const RelancesScreen: React.FC = () => {
  const [form, setForm] = useState({
    date: '',
    time: '',
    suiveur: '',
    entreprise: '',
  });

  const [entreprises, setEntreprises] = useState([
    { name: 'Entreprise 1', status: 'Non relancé' },
    { name: 'Entreprise 2', status: 'Relancé' },
    // Ajoutez plus d'entreprises ici
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  const handleRelancer = (index: number) => {
    const newEntreprises = [...entreprises];
    newEntreprises[index].status = 'Relancé';
    setEntreprises(newEntreprises);
  };

  return (
    <div className="container">
      <h1>Relances Entreprises</h1>

      <div className="entreprises-list">
        <h2>Liste des Entreprises avec Statut de Relance</h2>
        <ul>
          {entreprises.map((entreprise, index) => (
            <li key={index}>
              {entreprise.name} - {entreprise.status}
              <button onClick={() => handleRelancer(index)}>Relancer</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-container">
        <h2>Formulaire de Prise de RDV avec Suiveur</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="entreprise">Entreprise :</label>
            <input type="text" id="entreprise" name="entreprise" value={form.entreprise} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date :</label>
            <input type="date" id="date" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="time">Heure :</label>
            <input type="time" id="time" name="time" value={form.time} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="suiveur">Suiveur :</label>
            <select id="suiveur" name="suiveur" value={form.suiveur} onChange={handleChange}>
              <option value="">Sélectionner</option>
              <option value="suiveur1">Suiveur 1</option>
              <option value="suiveur2">Suiveur 2</option>
              <option value="suiveur3">Suiveur 3</option>
            </select>
          </div>
          <button type="submit">Soumettre</button>
        </form>
      </div>

      <div className="calendar-container">
        <h2>Calendrier des Disponibilités des Suiveurs</h2>
        {/* Intégration du calendrier ici */}
      </div>
    </div>
  );
};

export default RelancesScreen;
