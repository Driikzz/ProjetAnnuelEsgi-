import React, { useState } from 'react';
import './styles/GestionComptes.css';
import { FaTrash } from 'react-icons/fa';

interface Suiveur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  tags: string[];
}

const GestionComptes: React.FC = () => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'Alternant',
    tags: '',
  });

  const [suiveurs, setSuiveurs] = useState<Suiveur[]>([
    { id: 1, nom: 'Suiveur', prenom: '1', email: 'suiveur1@example.com', role: 'Suiveur', tags: ['B1'] },
    { id: 2, nom: 'Suiveur', prenom: '2', email: 'suiveur2@example.com', role: 'Suiveur', tags: ['B2'] },
    // Ajoutez plus de suiveurs ici si nécessaire
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [expandedTags, setExpandedTags] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSuiveur: Suiveur = {
      id: suiveurs.length + 1,
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      role: form.role,
      tags: form.tags.split(',').map(tag => tag.trim()),
    };
    setSuiveurs([...suiveurs, newSuiveur]);
    setForm({ nom: '', prenom: '', email: '', role: 'Alternant', tags: '' });
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    const updatedSuiveurs = suiveurs.filter((suiveur) => suiveur.id !== id);
    setSuiveurs(updatedSuiveurs);
  };

  const handleToggleTag = (tag: string) => {
    setExpandedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const renderTableByRole = (role: string) => {
    const suiveursByRole = suiveurs.filter(suiveur => suiveur.role === role);

    const tags = Array.from(new Set(suiveursByRole.flatMap((suiveur) => suiveur.tags)));

    return (
      <div className="suiveurs-list" key={role}>
        <h2>Liste des {role}s</h2>
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              {editMode && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <React.Fragment key={tag}>
                <tr className="tag-header" onClick={() => handleToggleTag(tag)}>
                  <td colSpan={editMode ? 5 : 4}>
                    {tag} {expandedTags.includes(tag) ? '-' : '+'}
                  </td>
                </tr>
                {expandedTags.includes(tag) && suiveursByRole
                  .filter((suiveur) => suiveur.tags.includes(tag))
                  .sort((a, b) => a.nom.localeCompare(b.nom))
                  .map((suiveur) => (
                    <tr key={suiveur.id}>
                      <td>{tag}</td>
                      <td>{suiveur.nom}</td>
                      <td>{suiveur.prenom}</td>
                      <td>{suiveur.email}</td>
                      {editMode && (
                        <td>
                          <button onClick={() => handleDelete(suiveur.id)} className="delete-button">
                            <FaTrash />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Gestion des Comptes Suiveurs Externes</h1>

      <button className="open-modal-button" onClick={() => setIsModalOpen(true)}>Ajouter un utilisateur</button>
      <button className="edit-mode-button" onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Terminer les modifications' : 'Modifier'}
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Formulaire de Création de Compte par Admin</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nom">Nom :</label>
                <input type="text" id="nom" name="nom" value={form.nom} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="prenom">Prénom :</label>
                <input type="text" id="prenom" name="prenom" value={form.prenom} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email :</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="role">Rôle :</label>
                <select id="role" name="role" value={form.role} onChange={handleChange}>
                  <option value="Alternant">Alternant</option>
                  <option value="Suiveur">Suiveur</option>
                  <option value="Tuteur">Tuteur</option>
                  <option value="Responsable pédagogique">Responsable pédagogique</option>
                  <option value="Responsable relations entreprises (Cre)">Responsable relations entreprises (Cre)</option>
                  <option value="Admin / Directeur">Admin / Directeur</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="tags">Tags (séparés par des virgules) :</label>
                <input type="text" id="tags" name="tags" value={form.tags} onChange={handleChange} />
              </div>
              <button type="submit">Créer Compte</button>
            </form>
          </div>
        </div>
      )}

      {renderTableByRole('Alternant')}
      {renderTableByRole('Suiveur')}
      {renderTableByRole('Tuteur')}
      {renderTableByRole('Responsable pédagogique')}
      {renderTableByRole('Responsable relations entreprises (Cre)')}
      {renderTableByRole('Admin / Directeur')}
    </div>
  );
};

export default GestionComptes;
