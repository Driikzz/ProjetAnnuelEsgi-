import React, { useState, useEffect } from 'react';
import './styles/GestionEntreprise.css';
import { FaTrash, FaPlus, FaEdit, FaSearch } from 'react-icons/fa';
import EntrepriseService from '../services/EntrepriseService';
import UserService from '../services/UserService';
import { IEntreprise } from '../interfaces/IEntreprise';
import { IUser } from '../interfaces/IUsers';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import DuoService from '../services/DuoService';

const GestionEntreprise: React.FC = () => {
  const initialFormState: IEntreprise = {
    id: 0,
    name: '',
    address: '',
    mail: '',
    phone: '',
    userId: []
  };

  const [form, setForm] = useState<IEntreprise>(initialFormState);
  const [entreprises, setEntreprises] = useState<IEntreprise[]>([]);
  const [token, setToken] = useState<string>('');
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentEntrepriseId, setCurrentEntrepriseId] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<IUser[][]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [duoEntreprise, setDuoEntreprise] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { getItem } = useAsyncStorage('token');
  const [isModalOpenDuo, setIsModalOpenDuo] = useState<boolean>(false);

  const [alternants, setAlternants] = useState<IUser[]>([]);
  const [tuteurs, setTuteurs] = useState<IUser[]>([]);
  const [suiveurs, setSuiveurs] = useState<IUser[]>([]);

  const [selectedDuo, setSelectedDuo] = useState<any>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await getItem();
      if (savedToken) {
        setToken(savedToken);
      }
    };

    const fetchEntreprises = async () => {
      if (token) {
        const fetchedEntreprises = await EntrepriseService.getAllEntreprises(token);
        console.log('Entreprises récupérées:', fetchedEntreprises);
        setEntreprises(fetchedEntreprises);
      }
    };

    fetchToken();
    fetchEntreprises();
  }, [token]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (token) {
        const fetchedUsers = await UserService.getAllUsers(token);
        setAllUsers(fetchedUsers);
      }
    };

    if (token) {
      fetchUsers();
    }
  } , [token]);

  useEffect(() => {
    if (allUsers) {
        setAlternants(allUsers.filter(user => user.role === 'Alternant'));
        setTuteurs(allUsers.filter(user => user.role === 'Tuteur'));
        setSuiveurs(allUsers.filter(user => user.role === 'Suiveur'));
    }

    console.log('alertants:', alternants, 'tuteurs:', tuteurs, 'suiveurs:', suiveurs);
  }, [allUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm.length > 2) {
      try {
        const results = await UserService.getAllUsers(token);
        const filteredResults = results.filter((user: IUser) =>
          `${user.name} ${user.lastname} ${user.role}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (user: IUser, groupIndex: number) => {
    const newSelectedGroups = [...selectedGroups];
    if (!newSelectedGroups[groupIndex]) {
      newSelectedGroups[groupIndex] = [];
    }
    if (!newSelectedGroups[groupIndex].find((u: IUser) => u.id === user.id)) {
      newSelectedGroups[groupIndex] = [...newSelectedGroups[groupIndex], user];
      setSelectedGroups(newSelectedGroups);
      setForm({
        ...form,
        userId: newSelectedGroups.map(group => group.map((u: any) => u.id))
      });
      setSearchResults([]);
    }
  };

  const handleGroupAdd = () => {
    setSelectedGroups([...selectedGroups, []]);
  };

  const handleUserRemove = (userId: number, groupIndex: number) => {
    const newSelectedGroups = selectedGroups.map((group, index) => {
      if (index === groupIndex) {
        return group.filter((u: IUser) => u.id !== userId);
      }
      return group;
    }).filter(group => group.length > 0);
    setSelectedGroups(newSelectedGroups);
    setForm({
      ...form,
      userId: newSelectedGroups.map(group => group.map((u: any) => u.id))
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newEntreprise = { ...form, userId: form.userId };

      if (isEdit && currentEntrepriseId !== null) {
        await EntrepriseService.updateEntreprise(currentEntrepriseId, newEntreprise, token);
        console.log('Entreprise mise à jour:', newEntreprise);
      } else {
        await EntrepriseService.createEntreprise(newEntreprise, token);
        console.log('Entreprise créée:', newEntreprise);
      }

      setForm(initialFormState);
      setIsFormVisible(false);
      setIsEdit(false);
      setCurrentEntrepriseId(null);
      setSelectedGroups([]);

      const fetchedEntreprises = await EntrepriseService.getAllEntreprises(token);
      console.log('Entreprises après création/mise à jour:', fetchedEntreprises);
      setEntreprises(fetchedEntreprises);
    } catch (error) {
      console.error('Erreur lors de la création/mise à jour de l\'entreprise:', error);
    }
  };

  const handleCreate = () => {
    setForm(initialFormState);
    setIsEdit(false);
    setIsFormVisible(true);
    setSelectedGroups([]);
  };

  const handleEdit = async (entreprise: IEntreprise) => {
    try {
      const userDetails = await UserService.getAllUsers(token);
      const userIdGroupsWithDetails = (Array.isArray(entreprise.userId) ? entreprise.userId : [])
        .map(group => Array.isArray(group) ? group.map((id: number) => userDetails.find((user: IUser) => user.id === id) || { id, name: '', lastname: '' }) : []);

      setForm({
        id: entreprise.id,
        name: entreprise.name,
        address: entreprise.address,
        mail: entreprise.mail,
        phone: entreprise.phone,
        userId: entreprise.userId.map(group => Array.isArray(group) ? group.filter((id): id is number => id !== undefined) : [])
      });
      setIsEdit(true);
      setCurrentEntrepriseId(entreprise.id);
      setIsFormVisible(true);
      setSelectedGroups(userIdGroupsWithDetails);
    } catch (error) {
      console.error('Erreur lors de l\'édition de l\'entreprise:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await EntrepriseService.deleteEntreprise(id, token);
      const fetchedEntreprises = await EntrepriseService.getAllEntreprises(token);
      console.log('Entreprises après suppression:', fetchedEntreprises);
      setEntreprises(fetchedEntreprises);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'entreprise:', error);
    }
  };

  const renderSearchResults = () => (
    <ul className="search-results">
      {searchResults.map((user) => (
        <li key={user.id} onClick={() => handleUserSelect(user, selectedGroups.length - 1)}>
          {user.name} {user.lastname}
        </li>
      ))}
    </ul>
  );

  const modifierDuoAffichage = (entrepriseId : number) => {
    const fetchDuo = async () => {
      try{
        const entrepriseDuos = await DuoService.getDuoByEntrepriseId(entrepriseId, token);
        setDuoEntreprise(entrepriseDuos);
        setIsModalOpenDuo(true);
      } catch (error) {
        console.error('Erreur lors de la récupération des duos de l\'entreprise:', error);
      }
  }
  if (entrepriseId) {
    fetchDuo();
  }
 }

 const closeDuoModal = () => {
  setIsModalOpenDuo(false);
}

  const handleUpdateDuo = () => {
    try{
      DuoService.updateDuoUsers(selectedDuo.idDuo, selectedDuo, token);
      console.log('Duo mis à jour:', selectedDuo);
      closeDuoModal();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du duo:', error);
    }
  };

  const getUserNameById = (userId:any) => {
    const user = allUsers.find(user => user.id === userId);
    return user ? `${user.name} ${user.lastname}` : '';
};


  const handleChangeduo = (field:any, value:any) => {
    setSelectedDuo({
        ...selectedDuo,
        [field]: value
    });
};

  return (
    <div className="container">
      <h1>Gestion des Entreprises</h1>
      <button onClick={handleCreate}>Créer Entreprise</button>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      {isFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsFormVisible(false)}>&times;</span>
            <h2>{isEdit ? 'Modifier Entreprise' : 'Créer Entreprise'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nom :</label>
                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="address">Adresse :</label>
                <input type="text" id="address" name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="mail">Mail :</label>
                <input type="email" id="mail" name="mail" value={form.mail} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Téléphone :</label>
                <input type="text" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
             {!isEdit && (
              <div>
               <div className="form-group">
               <label htmlFor="userSearch">Recherche d'utilisateurs :</label>
               <input type="text" id="userSearch" name="userSearch" onChange={handleSearchChange} />
               {renderSearchResults()}
             </div>
             <div className="selected-groups">
               <h3>Groupes d'utilisateurs sélectionnés :</h3>
               {selectedGroups.map((group, groupIndex) => (
                 <div key={groupIndex} className="group">
                   <h4>Groupe {groupIndex + 1}</h4>
                   <ul>
                     {group.map((user: any) => (
                       <li key={user.id}>
                         <span>{user.name} {user.lastname} ({user.role})</span>
                         <button type="button" onClick={() => handleUserRemove(user.id, groupIndex)}>
                           <span role="img" aria-label="remove">🗑️</span>
                         </button>
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
               <button type="button" onClick={handleGroupAdd}>Ajouter un groupe</button>
             </div>
             </div> 
             )}
              <div className="button-group">
                <button type="submit">{isEdit ? 'Mettre à jour' : 'Créer'}</button>
                <button type="button" onClick={() => setIsFormVisible(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <h2>Liste des Entreprises</h2>
      <ul>
        {entreprises.map((entreprise) => (
          <li key={entreprise.id}>
            {entreprise.name} - {entreprise.address} - {entreprise.mail} - {entreprise.phone}
            <button onClick={() => handleEdit(entreprise)}>Modifier</button>
            {isEdit ? (
                  <button onClick={() => {modifierDuoAffichage(entreprise.id)}}>Modifier les duos</button>
              ) : (
                  null
              )}
            <button onClick={() => handleDelete(entreprise.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
      {isModalOpenDuo && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeDuoModal}>&times;</span>
                        <h2>Modifier les duos</h2>
                        <ul>
                            {duoEntreprise.map((duo:any, index:any) => (
                                <li key={index}>
                                    {selectedDuo && selectedDuo.idDuo === duo.idDuo ? (
                                        <form>
                                            <label>
                                                Alternant:
                                                <select
                                                    value={selectedDuo.idAlternant}
                                                    onChange={(e) => handleChangeduo('idAlternant', parseInt(e.target.value))}>
                                                    {alternants.map(user => (
                                                        <option key={user.id} value={user.id}>{user.name} {user.lastname}</option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label>
                                                Tuteur:
                                                <select
                                                    value={selectedDuo.idTuteur}
                                                    onChange={(e) => handleChangeduo('idTuteur', parseInt(e.target.value))}>
                                                    {tuteurs.map(user => (
                                                        <option key={user.id} value={user.id}>{user.name} {user.lastname}</option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label>
                                                Suiveur:
                                                <select
                                                    value={selectedDuo.idSuiveur}
                                                    onChange={(e) => handleChangeduo('idSuiveur', parseInt(e.target.value))}>
                                                    {suiveurs.map(user => (
                                                        <option key={user.id} value={user.id}>{user.name} {user.lastname}</option>
                                                    ))}
                                                </select>
                                            </label>

                                            <button type="button" onClick={handleUpdateDuo}>Modifier le duo</button>
                                        </form>
                                    ) : (
                                        <div>
                                            <h3>Duo {index +1}</h3>
                                            Alternant: {getUserNameById(duo.idAlternant)}, Tuteur: {getUserNameById(duo.idTuteur)}, Suiveur: {getUserNameById(duo.idSuiveur)}
                                            <button onClick={() => setSelectedDuo(duo)}>Modifier</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionEntreprise;
