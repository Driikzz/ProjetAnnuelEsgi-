import React, { useState } from 'react';
import './styles/SuiviEntretiensScreen.css'; // Importer le fichier CSS

interface Entretien {
  id: number;
  date: string;
  alternantId: number;
  tuteurId: number;
  resultat: string;
}

interface Person {
  id: number;
  name: string;
}

const alternants: Person[] = [
  { id: 1, name: 'Jean Dupont' },
  { id: 2, name: 'Marie Durand' },
  // Ajoutez plus d'alternants ici si nécessaire
];

const tuteurs: Person[] = [
  { id: 1, name: 'M. Martin' },
  { id: 2, name: 'Mme. Bernard' },
  // Ajoutez plus de tuteurs ici si nécessaire
];

const SuiviEntretiensScreen: React.FC = () => {
  const [entretiens, setEntretiens] = useState<Entretien[]>([
    { id: 1, date: '2024-05-20', alternantId: 1, tuteurId: 1, resultat: 'En attente' },
    { id: 2, date: '2024-05-22', alternantId: 2, tuteurId: 2, resultat: 'Accepté' },
    // Ajoutez plus d'entretiens ici si nécessaire
  ]);

  const [expandedEntretienId, setExpandedEntretienId] = useState<number | null>(null);
  const [form, setForm] = useState({ date: '', resultat: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent, entretienId: number) => {
    e.preventDefault();
    const updatedEntretiens = entretiens.map(entretien =>
      entretien.id === entretienId ? { ...entretien, ...form } : entretien
    );
    setEntretiens(updatedEntretiens);
    setForm({ date: '', resultat: '' });
    setExpandedEntretienId(null);
  };

  const toggleExpanded = (id: number) => {
    setExpandedEntretienId(expandedEntretienId === id ? null : id);
  };

  const getPersonName = (id: number, persons: Person[]) => {
    const person = persons.find(p => p.id === id);
    return person ? person.name : 'Unknown';
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
                <strong>{getPersonName(entretien.alternantId, alternants)}</strong> - {getPersonName(entretien.tuteurId, tuteurs)}
              </div>
              <p><strong>Date:</strong> {entretien.date}</p>
              <p><strong>Résultat:</strong> {entretien.resultat}</p>
              <button onClick={() => toggleExpanded(entretien.id)} className="alerteButton">
                {expandedEntretienId === entretien.id ? 'Fermer le compte rendu' : 'Saisir le compte rendu'}
              </button>
              {expandedEntretienId === entretien.id && (
                <form onSubmit={(e) => handleSubmit(e, entretien.id)} className="formContainer">
                  <div className="formGroup">
                    <label htmlFor="date">Date:</label>
                    <input type="date" id="date" name="date" value={form.date} onChange={handleChange} required />
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
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuiviEntretiensScreen;
