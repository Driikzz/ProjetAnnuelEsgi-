import React, { useState } from 'react';
import './styles/SuiviEntretiensScreen.css'; // Importer le fichier CSS

interface Entretien {
  id: number;
  date: string;
  alternantId: number;
  tuteurId: number;
}

interface Person {
  id: number;
  name: string;
}

interface Alerte {
  type: string;
  message: string;
  dateCreation: string;
  idCreateur: number;
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
    { id: 1, date: '2024-05-20', alternantId: 1, tuteurId: 1 },
    { id: 2, date: '2024-05-22', alternantId: 2, tuteurId: 2 },
    // Ajoutez plus d'entretiens ici si nécessaire
  ]);

  const [alerts, setAlerts] = useState<Alerte[]>([]);
  const [treatedAlerts, setTreatedAlerts] = useState<Alerte[]>([]); // For treated alerts
  const [expandedEntretienId, setExpandedEntretienId] = useState<number | null>(null);
  const [form, setForm] = useState({
    date: '',
    integrationProblem: '',
    integrationDetails: '',
    taskProblem: '',
    taskDetails: '',
    comments: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlertPopup, setShowAlertPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent, entretienId: number) => {
    e.preventDefault();

    const newAlerts: Alerte[] = [];

    if (form.integrationProblem === 'Oui') {
      newAlerts.push({
        type: 'Problème d\'intégration',
        message: form.integrationDetails,
        dateCreation: form.date,
        idCreateur: entretienId
      });
    }

    if (form.taskProblem === 'Oui') {
      newAlerts.push({
        type: 'Problème de tâche',
        message: form.taskDetails,
        dateCreation: form.date,
        idCreateur: entretienId
      });
    }

    setAlerts([...alerts, ...newAlerts]);

    // Update the entretien data based on form submission (this is for local state update, real implementation might save to a backend)
    const updatedEntretiens = entretiens.map(entretien =>
      entretien.id === entretienId ? { ...entretien, ...form } : entretien
    );
    setEntretiens(updatedEntretiens);
    setForm({
      date: '',
      integrationProblem: '',
      integrationDetails: '',
      taskProblem: '',
      taskDetails: '',
      comments: ''
    });
    setExpandedEntretienId(null);
  };

  const toggleExpanded = (id: number) => {
    setExpandedEntretienId(expandedEntretienId === id ? null : id);
  };

  const getPersonName = (id: number, persons: Person[]) => {
    const person = persons.find(p => p.id === id);
    return person ? person.name : 'Unknown';
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredEntretiens = entretiens.filter(entretien => {
    const alternantName = getPersonName(entretien.alternantId, alternants).toLowerCase();
    const tuteurName = getPersonName(entretien.tuteurId, tuteurs).toLowerCase();
    return alternantName.includes(searchTerm) || tuteurName.includes(searchTerm);
  });

  const handleAlertClick = () => {
    setShowAlertPopup(true);
  };

  const handleCloseAlertPopup = () => {
    setShowAlertPopup(false);
  };

  return (
    <div className="container">
      <h1 className="header">Suivi des Entretiens</h1>
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Rechercher par alternant ou tuteur"
          value={searchTerm}
          onChange={handleSearch}
          className="searchInput"
        />
      </div>
      <div className="entretiensList">
        <h2 className="subHeader">Liste des Entretiens Programmés</h2>
        <ul>
          {filteredEntretiens.map((entretien) => (
            <li key={entretien.id} className="card">
              <div className="cardHeader">
                <strong>{getPersonName(entretien.alternantId, alternants)}</strong> - {getPersonName(entretien.tuteurId, tuteurs)}
              </div>
              <p><strong>Date:</strong> {entretien.date}</p>
              <button onClick={() => toggleExpanded(entretien.id)} className="alerteButton">
                {expandedEntretienId === entretien.id ? 'Fermer le compte rendu' : 'Saisir le compte rendu'}
              </button>
              {expandedEntretienId === entretien.id && (
                <div className="modal">
                  <div className="modalContent">
                    <span className="closeButton" onClick={() => setExpandedEntretienId(null)}>&times;</span>
                    <form onSubmit={(e) => handleSubmit(e, entretien.id)} className="formContainer">
                      <div className="formGroup">
                        <label htmlFor="date">Date:</label>
                        <input type="date" id="date" name="date" value={form.date} onChange={handleChange} required />
                      </div>
                      <div className="formGroup">
                        <label htmlFor="integrationProblem">Problème d'intégration:</label>
                        <select id="integrationProblem" name="integrationProblem" value={form.integrationProblem} onChange={handleChange} required>
                          <option value="">Sélectionner</option>
                          <option value="Oui">Oui</option>
                          <option value="Non">Non</option>
                        </select>
                      </div>
                      {form.integrationProblem === 'Oui' && (
                        <div className="formGroup">
                          <label htmlFor="integrationDetails">Détails du problème d'intégration:</label>
                          <textarea id="integrationDetails" name="integrationDetails" value={form.integrationDetails} onChange={handleChange} required />
                        </div>
                      )}
                      <div className="formGroup">
                        <label htmlFor="taskProblem">Problème de tâche:</label>
                        <select id="taskProblem" name="taskProblem" value={form.taskProblem} onChange={handleChange} required>
                          <option value="">Sélectionner</option>
                          <option value="Oui">Oui</option>
                          <option value="Non">Non</option>
                        </select>
                      </div>
                      {form.taskProblem === 'Oui' && (
                        <div className="formGroup">
                          <label htmlFor="taskDetails">Détails du problème de tâche:</label>
                          <textarea id="taskDetails" name="taskDetails" value={form.taskDetails} onChange={handleChange} required />
                        </div>
                      )}
                      <div className="formGroup">
                        <label htmlFor="comments">Commentaires:</label>
                        <textarea id="comments" name="comments" value={form.comments} onChange={handleChange} required />
                      </div>
                      <button type="submit" className="submitButton">Soumettre</button>
                    </form>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="alertSummary" onClick={handleAlertClick}>
        <div>Alertes créées: {alerts.length}</div>
        <div>Alertes traitées: {treatedAlerts.length}</div>
      </div>
      {showAlertPopup && (
        <div className="popup">
          <div className="popupContent">
            <h2>Résumé des Alertes</h2>
            <span className="closeButton" onClick={handleCloseAlertPopup}>&times;</span>
            <h3>Alertes créées</h3>
            <ul>
              {alerts.map((alerte, index) => (
                <li key={index} className="card">
                  <div className="cardHeader">
                    <strong>{alerte.type}</strong>
                    <span>{alerte.dateCreation}</span>
                  </div>
                  <p>{alerte.message}</p>
                  <p><strong>ID Createur:</strong> {alerte.idCreateur}</p>
                </li>
              ))}
            </ul>
            <h3>Alertes traitées</h3>
            <ul>
              {treatedAlerts.map((alerte, index) => (
                <li key={index} className="card">
                  <div className="cardHeader">
                    <strong>{alerte.type}</strong>
                    <span>{alerte.dateCreation}</span>
                  </div>
                  <p>{alerte.message}</p>
                  <p><strong>ID Createur:</strong> {alerte.idCreateur}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuiviEntretiensScreen;
