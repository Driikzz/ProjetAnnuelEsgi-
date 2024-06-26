import React, { useEffect, useState } from 'react';
import './styles/GestionComptes.css';
import { FaTrash, FaPlus, FaEdit, FaDownload, FaSearch } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import UserService from '../services/UserService';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import IUser from '../interfaces/IUsers';


const GestionComptesSuiveursScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [expandedTags, setExpandedTags] = useState<string[]>([]);
  const [expandedRoles, setExpandedRoles] = useState<string[]>([]);
  const [batchUsers, setBatchUsers] = useState([{ name: '', lastname: '', email: '', tag: '', password: '',phone: '', role: ''}]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [token, setToken] = useState('');
  const { getItem } = useAsyncStorage('token');
  const [users, setUsers] = useState<IUser[]>([]);

  // État par rôle
  const [alternants, setAlternants] = useState<IUser[]>([]);
  const [suiveursRole, setSuiveursRole] = useState<IUser[]>([]);
  const [tuteurs, setTuteurs] = useState<IUser[]>([]);
  const [responsables, setResponsables] = useState<IUser[]>([]);
  const [admins, setAdmins] = useState<IUser[]>([]);
  
  // État pour l'affichage global
  const [showAllUsers, setShowAllUsers] = useState(false);

  // Définir l'état pour le formulaire
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    password:'',
    email: '',
    phone: '',
    role: 'Alternant',
    tags: '',
  });

  useEffect(() => {
    const getToken = async () => {
      try {
        const savedToken = await getItem();
        if (savedToken !== null) {
          setToken(savedToken);
        }
      } catch (error) {
        console.error('Error loading token from AsyncStorage:', error);
      }
    };

    getToken();
  }, [getItem]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await UserService.getAllUsers(token!); // Add type assertion (!) to ensure token is of type string
        console.log(" all users :", response);
        setUsers(response);

        // Mise à jour des états par rôle
        setAlternants(response.filter((user: IUser) => user.role === 'Alternant'));
        setSuiveursRole(response.filter((user: IUser) => user.role === 'Suiveur'));
        setTuteurs(response.filter((user: IUser) => user.role === 'Tuteur'));
        setResponsables(response.filter((user: IUser) => 
          user.role === 'Responsable pédagogique' || user.role === 'Responsable relations entreprises (Cre)'));
        setAdmins(response.filter((user: IUser) => user.role === 'Admin / Directeur'));
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchAllUsers();
    }
  }, [token]);

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
    setBatchUsers([...batchUsers, { name: '', lastname: '', email: '', tag: '' , password: '',phone: '', role: ''}]);
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
          name: String(row['Nom'] || ''),
          lastname: String(row['Prénom'] || ''),
          password: String(row['password'] || ''),
          email: String(row['Email'] || ''),
          phone: String(row['Phonz'] || ''),
          tag: String(row['Tags'] || ''),
          role: String(row['Role'] || ''),
        }));

        setBatchUsers(newBatchUsers);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([{ Nom: '', Prénom: '', Email: '', Tags: '' }]);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_utilisateurs.xlsx');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUsers: IUser = {
      id: users.length + 1,
      name: form.name,
      lastname: form.lastname,
      password: form.password,
      email: form.email,
      role: form.role,
      tag: form.tags.split(',').map(tag => tag.trim()),
    };
    setUsers([...users, newUsers]);
    setForm({ name: '', lastname: '',password: '', email: '',phone: '' , role: 'Alternant', tags: '' });
    setIsModalOpen(false);
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUsers = batchUsers.map((user:any, index) => ({
      name: user.name,
      lastname: user.lastname,
      password: user.password,
      email: user.email,
      phone: user.phone,
      role: form.role,
      tag: user.tag.split(',').map((tag:any) => tag.trim()),
    }));
    setUsers([...users, ...newUsers]);
    setBatchUsers([{ name: '', lastname: '', password:'', email: '',phone: '', role: '' , tag: '' }]);
    setIsBatchModalOpen(false);
  };

  const handleDelete = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
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

  const handleEditUser = (user: IUser) => {
    setEditUser(user);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editUser) {
      setEditUser({
        ...editUser,
        [e.target.name]: e.target.value,
        tag: (e.target.name === 'tags' ? e.target.value.split(',').map(tag => tag.trim()) : editUser.tag) as string[]
      });
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser) {
      const updatedSuiveurs = users.map((user:any) =>
        user.id === editUser.id ? { ...editUser } : user
      );
      setUsers(updatedSuiveurs);
      setEditUser(null);
    }
  };

  const handleCreateAccount = () => {
    const newUsers: IUser = {
      id: users.length + 1,
      name: form.name,
      lastname: form.lastname,
      password: form.password,
      email: form.email,
      phone: form.phone,
      role: form.role,
      tag: form.tags.split(',').map(tag => tag.trim()),
    };
    setUsers([...users, newUsers]);
    setForm({ name: '', lastname: '',password: '', email: '',phone: '', role: 'Alternant', tags: '' });
    setIsModalOpen(false);
    try{
      UserService.createUser(newUsers);
      console.log("newUsers", newUsers);
    } catch (error) {
      console.error(error);
    }
  }

  const renderTableByRole = (role: string, suiveursByRole: IUser[]) => {
    const tags = Array.from(new Set(suiveursByRole.flatMap((suiveur) => suiveur.tag || [])));

    return (
      <div className="suiveurs-list" key={role}>
        <h2 className="role-header" onClick={() => handleToggleRole(role)}>
          {role} {expandedRoles.includes(role) ? '-' : '+'}
        </h2>
        {expandedRoles.includes(role) && (
          <table className={editMode ? 'edit-mode' : ''}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Tags</th>
                {editMode && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {suiveursByRole.map((suiveur:any) => (
                <tr key={suiveur.id}>
                  <td>{suiveur.name}</td>
                  <td>{suiveur.lastname}</td>
                  <td>{suiveur.email}</td>
                  <td>{(suiveur.tag || [])}</td>
                  {editMode && (
                    <td>
                      <button onClick={() => handleDelete(suiveur.id)} className="delete-button">
                        <FaTrash />
                      </button>
                      <button onClick={() => handleEditUser(suiveur.id)} className="edit-button">
                        <FaEdit />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const renderAllUsersTable = () => {
    const filteredSuiveurs = users.filter(user =>
      (user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );

    return (
      <div className="all-users-list">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            {filteredSuiveurs.map((suiveur:any) => (
              <tr key={suiveur.id}>
                <td>{suiveur.lastname}</td>
                <td>{suiveur.name}</td>
                <td>{suiveur.email}</td>
                <td>{suiveur.role}</td>
                <td>{(suiveur.tags || []).join(', ')}</td>
                {editMode && (
                  <td>
                    <button onClick={() => handleDelete(suiveur.id)} className="delete-button">
                      <FaTrash />
                    </button>
                    <button onClick={() => handleEditUser(suiveur)} className="edit-button">
                      <FaEdit />
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
                <label htmlFor="editNom">Nom :</label>
                <input type="text" id="editNom" name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="editPrenom">Prénom :</label>
                <input type="text" id="editPrenom" name="lastname" value={form.lastname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email :</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe :</label>
                <input type="password" id="password" name="password" value={form.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Téléphone :</label>
                <input type="text" id="phone" name="phone" value={form.phone} onChange={handleChange} />
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
              <button type="submit" onClick={handleCreateAccount}>Créer Compte</button>
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
                      <th>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchUsers.map((user, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={user.lastname}
                            onChange={(e) => handleBatchUserChange(index, 'nom', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={user.name}
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
                        <td>
                          <input
                            type="text"
                            value={user.tag}
                            onChange={(e) => handleBatchUserChange(index, 'tags', e.target.value)}
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
              <button type="submit">Créer Comptes</button>
            </form>
          </div>
        </div>
      )}

      {showAllUsers ? (
        renderAllUsersTable()
      ) : (
        <>
          {renderTableByRole('Admins / Directeurs', admins)}
          {renderTableByRole('Responsables', responsables)}
          {renderTableByRole('Suiveurs', suiveursRole)}
          {renderTableByRole('Tuteurs', tuteurs)}
          {renderTableByRole('Alternants', alternants)}
        </>
      )}

      {editUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setEditUser(null)}>&times;</span>
            <h2>Modifier l'utilisateur</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label htmlFor="editNom">Nom :</label>
                <input type="text" id="editNom" name="nom" value={editUser.name} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label htmlFor="editPrenom">Prénom :</label>
                <input type="text" id="editPrenom" name="prenom" value={editUser.lastname} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label htmlFor="editEmail">Email :</label>
                <input type="email" id="editEmail" name="email" value={editUser.email} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label htmlFor="editRole">Rôle :</label>
                <select id="editRole" name="role" value={editUser.role} onChange={handleEditChange}>
                  <option value="Alternant">Alternant</option>
                  <option value="Suiveur">Suiveur</option>
                  <option value="Tuteur">Tuteur</option>
                  <option value="RP">Responsable pédagogique</option>
                  <option value="CRE">Responsable relations entreprises (Cre)</option>
                  <option value="Admin / Directeur">Admin / Directeur</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editTags">Tags (séparés par des virgules) :</label>
                <input
                  type="text"
                  id="editTags"
                  name="tags"
                  value={(editUser.tag || []).join(', ')}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editPhone">Téléphone :</label>
                <input type="text" id="editPhone" name="phone" value={editUser.phone} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label htmlFor="editPassword">Mot de passe :</label>
                <input type="password" id="editPassword" name="password" value={editUser.password} onChange={handleEditChange} />
              </div>

              <button type="submit">Modifier</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionComptesSuiveursScreen;
