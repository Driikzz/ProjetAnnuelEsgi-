import React, { useState } from 'react';
import './styles/SuiviEntretiensScreen.css'; // Importer le fichier CSS

interface Entretien {
  id: number;
  date: string;
  candidat: string;
  entreprise: string;
  resultat: string;
}

const SuiviEntretiensScreen: React.FC = () => {
  const [entretiens, setEntretiens] = useState<Entretien[]>([
    { id: 1, date: '2024-05-20', candidat: 'Jean Dupont', entreprise: 'Entreprise X', resultat: 'En attente' },
    { id: 2, date: '2024-05-22', candidat: 'Marie Durand', entreprise: 'Entreprise Y', resultat: 'Accepté' },
    // Ajoutez plus d'entretiens ici si nécessaire
  ]);

  const [form, setForm] = useState({ id: 0, date: '', candidat: '', entreprise: '', resultat: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEntretiens([...entretiens, { ...form, id: entretiens.length + 1 }]);
    setForm({ id: 0, date: '', candidat: '', entreprise: '', resultat: '' });
  };

  const handleAlerte = (entretien: Entretien) => {
    alert(`Alerte créée pour l'entretien de ${entretien.candidat} avec ${entretien.entreprise}`);
  };

  return (
    <div className="container">
      <h1 className="header">Suivi des Entretiens</h1>
      <div className="entretiensList">
        <h2 className="subHeader">Liste des Entretiens Programmés</h2>
        <ul>
          {entretiens.map((entretien) => (
            <li key={entretien.id} className="card">
              <div className="cardHeader">
                <strong>{entretien.candidat}</strong> - {entretien.entreprise}
              </div>
              <p><strong>Date:</strong> {entretien.date}</p>
              <p><strong>Résultat:</strong> {entretien.resultat}</p>
              <button onClick={() => handleAlerte(entretien)} className="alerteButton">Créer Alerte</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="formContainer">
        <h2 className="subHeader">Formulaire pour Résultats des Entretiens</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" value={form.date} onChange={handleChange} required />
          </div>
          <div className="formGroup">
            <label htmlFor="candidat">Candidat:</label>
            <input type="text" id="candidat" name="candidat" value={form.candidat} onChange={handleChange} required />
          </div>
          <div className="formGroup">
            <label htmlFor="entreprise">Entreprise:</label>
            <input type="text" id="entreprise" name="entreprise" value={form.entreprise} onChange={handleChange} required />
          </div>
          <div className="formGroup">
            <label htmlFor="resultat">Résultat:</label>
            <select id="resultat" name="resultat" value={form.resultat} onChange={handleChange} required>
              <option value="">Sélectionner</option>
              <option value="Accepté">Accepté</option>
              <option value="Refusé">Refusé</option>
              <option value="En attente">En attente</option>
            </select>
          </div>
          <button type="submit" className="submitButton">Soumettre</button>
        </form>
      </div>
    </div>
  );
};

export default SuiviEntretiensScreen;
