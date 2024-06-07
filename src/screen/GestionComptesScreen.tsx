import React, { useState } from 'react';
import './styles/GestionComptes.css';
import { FaTrash, FaPlus, FaEdit, FaDownload, FaSearch } from 'react-icons/fa';
import * as XLSX from 'xlsx';

interface Suiveur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  tags: string[];
}

const GestionComptesSuiveursScreen: React.FC = () => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'Alternant',
    tags: '',
  });

  const [suiveurs, setSuiveurs] = useState<Suiveur[]>([
    { id: 1, nom: 'Suiveur', prenom: '1', email: 'suiveur1@example.com', role: 'Suiveur', tags: ['Tag1'] },
    { id: 2, nom: 'Suiveur', prenom: '2', email: 'suiveur2@example.com', role: 'Suiveur', tags: ['Tag2'] },
    // Ajoutez plus de suiveurs ici si nécessaire
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [expandedTags, setExpandedTags] = useState<string[]>([]);
  const [expandedRoles, setExpandedRoles] = useState<string[]>([]);
  const [batchUsers, setBatchUsers] = useState([{ nom: '', prenom: '', email: '' }]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState<Suiveur | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleBatchUserChange = (index: number, field: string, value: string) => {
    const newBatchUsers = [...batchUsers];
    newBatchUsers[index] = { ...newBatchUsers[index], [field]: value };
    setBatchUsers(newBatchUsers);
  };

  const handleAddBatchUser = () => {
    setBatchUsers([...batchUsers, { nom: '', prenom: '', email: '' }]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (typeof data === 'string') {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        const newBatchUsers = parsedData.map((row: any) => ({
          nom: String(row['Nom'] || ''),
          prenom: String(row['Prénom'] || ''),
          email: String(row['Email'] || ''),
        }));

        setBatchUsers(newBatchUsers);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([{ Nom: '', Prénom: '', Email: '' }]);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_utilisateurs.xlsx');
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

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSuiveurs = batchUsers.map((user, index) => ({
      id: suiveurs.length + index + 1,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: form.role,
      tags: form.tags.split(',').map(tag => tag.trim()),
    }));
    setSuiveurs([...suiveurs, ...newSuiveurs]);
    setBatchUsers([{ nom: '', prenom: '', email: '' }]);
    setIsBatchModalOpen(false);
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

  const handleToggleRole = (role: string) => {
    setExpandedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleEditUser = (user: Suiveur) => {
    setEditUser(user);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser) {
      const updatedSuiveurs = suiveurs.map((suiveur) =>
        suiveur.id === editUser.id ? { ...editUser, tags: editUser.tags.join(', ').split(',').map(tag => tag.trim()) } : suiveur
      );
      setSuiveurs(updatedSuiveurs);
      setEditUser(null);
    }
  };

  const renderTableByRole = (role: string) => {
    const suiveursByRole = suiveurs.filter(suiveur => suiveur.role === role);

    const tags = Array.from(new Set(suiveursByRole.flatMap((suiveur) => suiveur.tags)));

    return (
      <div className="suiveurs-list" key={role}>
        <h2 className="role-header" onClick={() => handleToggleRole(role)}>
          {role} {expandedRoles.includes(role) ? '-' : '+'}
        </h2>
        {expandedRoles.includes(role) && (
          <table className={editMode ? 'edit-mode' : ''}>
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
                            <button onClick={() => handleEditUser(suiveur)} className="edit-button">
                              <FaEdit />
                            </button>
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
        )}
      </div>
    );
  };

  const renderAllUsersTable = () => {
    const filteredSuiveurs = suiveurs.filter(suiveur =>
      suiveur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suiveur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suiveur.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="all-users-list">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Tags</th>
                {editMode && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredSuiveurs.map((suiveur) => (
                <tr key={suiveur.id}>
                  <td>{suiveur.nom}</td>
                  <td>{suiveur.prenom}</td>
                  <td>{suiveur.email}</td>
                  <td>{suiveur.role}</td>
                  <td>{suiveur.tags.join(', ')}</td>
                  {editMode && (
                    <td>
                      <button onClick={() => handleEditUser(suiveur)} className="edit-button">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(suiveur.id)} className="delete-button">
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
  
    return (
      <div className={`container ${editMode ? 'edit-mode-container' : ''}`}>
        <h1>Gestion des Comptes Suiveurs Externes</h1>
  
        <div className="header-buttons">
          <div className="dropdown">
            <FaPlus className="icon-button" />
            <div className="dropdown-content">
              <button onClick={() => setIsModalOpen(true)}>Ajouter un utilisateur</button>
              <button onClick={() => setIsBatchModalOpen(true)}>Ajouter en lot</button>
            </div>
          </div>
          <FaEdit className={`icon-button ${editMode ? 'active' : ''}`} onClick={() => setEditMode(!editMode)} />
          <FaDownload className="icon-button" onClick={handleDownloadTemplate} title="Télécharger le template" />
          <button className="icon-button" onClick={() => setShowAllUsers(!showAllUsers)}>
            <FaSearch /> {showAllUsers ? 'Vue par rôle' : 'Vue d’ensemble'}
          </button>
        </div>
  
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
  
        {isBatchModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={() => setIsBatchModalOpen(false)}>&times;</span>
              <h2>Formulaire de Création de Comptes en Lot par Admin</h2>
              <form onSubmit={handleBatchSubmit}>
                <div className="form-group">
                  <label htmlFor="nom">Noms et Prénoms :</label>
                  <table className="batch-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchUsers.map((user, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              value={user.nom}
                              onChange={(e) => handleBatchUserChange(index, 'nom', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={user.prenom}
                              onChange={(e) => handleBatchUserChange(index, 'prenom', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              value={user.email}
                              onChange={(e) => handleBatchUserChange(index, 'email', e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button type="button" onClick={handleAddBatchUser}>Ajouter une ligne</button>
                  <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                  <button type="button" onClick={handleDownloadTemplate} className="template-button">
                    Télécharger le template
                  </button>
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
                <button type="submit">Créer Comptes</button>
              </form>
            </div>
          </div>
        )}
  
        {showAllUsers ? (
          renderAllUsersTable()
        ) : (
          <>
            {renderTableByRole('Alternant')}
            {renderTableByRole('Suiveur')}
            {renderTableByRole('Tuteur')}
            {renderTableByRole('Responsable pédagogique')}
            {renderTableByRole('Responsable relations entreprises (Cre)')}
            {renderTableByRole('Admin / Directeur')}
          </>
        )}
  
        {editUser && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={() => setEditUser(null)}>&times;</span>
              <h2>Modifier Utilisateur</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="edit-nom">Nom :</label>
                  <input
                    type="text"
                    id="edit-nom"
                    name="nom"
                    value={editUser.nom}
                    onChange={(e) => setEditUser({ ...editUser, nom: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-prenom">Prénom :</label>
                  <input
                    type="text"
                    id="edit-prenom"
                    name="prenom"
                    value={editUser.prenom}
                    onChange={(e) => setEditUser({ ...editUser, prenom: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-email">Email :</label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-role">Rôle :</label>
                  <select
                    id="edit-role"
                    name="role"
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                >
                  <option value="Alternant">Alternant</option>
                  <option value="Suiveur">Suiveur</option>
                  <option value="Tuteur">Tuteur</option>
                  <option value="Responsable pédagogique">Responsable pédagogique</option>
                  <option value="Responsable relations entreprises (Cre)">Responsable relations entreprises (Cre)</option>
                  <option value="Admin / Directeur">Admin / Directeur</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="edit-tags">Tags (séparés par des virgules) :</label>
                <input
                  type="text"
                  id="edit-tags"
                  name="tags"
                  value={editUser.tags.join(', ')}
                  onChange={(e) => setEditUser({ ...editUser, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                />
              </div>
              <button type="submit">Enregistrer les modifications</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionComptesSuiveursScreen;
