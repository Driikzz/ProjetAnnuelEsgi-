import React, { useState } from 'react';
import '../App.css'; // Chemin relatif correct vers App.css

const PriseRdvScreen: React.FC = () => {
  const [form, setForm] = useState({
    date: '',
    time: '',
    suiveur: '',
    nom: '',
    formation: '',
    entreprise: ''
  });

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

  return (
    <div className="container">
      <h1>Prise de RDV - Période d'Essai</h1>
      <form onSubmit={handleSubmit}>
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
        <div className="form-group">
          <label htmlFor="nom">Nom :</label>
          <input type="text" id="nom" name="nom" value={form.nom} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="formation">Formation :</label>
          <input type="text" id="formation" name="formation" value={form.formation} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="entreprise">Entreprise :</label>
          <input type="text" id="entreprise" name="entreprise" value={form.entreprise} onChange={handleChange} />
        </div>
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default PriseRdvScreen;
