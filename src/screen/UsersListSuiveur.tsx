import React, { useEffect, useState } from 'react';
import './styles/GestionComptesScreenSuiveur.css';
import UserService from '../services/UserService';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import IUser from '../interfaces/IUsers';

const GestionComptesScreenSuiveur: React.FC = () => {
  const [token, setToken] = useState('');
  const { getItem } = useAsyncStorage('token');
  const [users, setUsers] = useState<IUser[]>([]);
  const [alternants, setAlternants] = useState<IUser[]>([]);
  const [tuteurs, setTuteurs] = useState<IUser[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
        const response = await UserService.getAllUsers(token!);
        setUsers(response);

        setAlternants(response.filter((user: IUser) => user.role === 'Alternant'));
        setTuteurs(response.filter((user: IUser) => user.role === 'Tuteur'));
      } catch (error) {
        console.error(error);
      }
    };
    if (token) {
      fetchAllUsers();
    }
  }, [token]);

  const handleToggleUserDetails = (id: number) => {
    setExpandedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const renderTableByRole = (role: string, usersByRole: IUser[]) => {
    const filteredUsers = usersByRole.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tag && Array.isArray(user.tag) && user.tag.join(',').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="GestionComptesScreenSuiveur-users-list" key={role}>
        <h2>{role}</h2>
        <table className="GestionComptesScreenSuiveur-table">
          <thead>
            <tr>
              <th className="GestionComptesScreenSuiveur-th">Nom</th>
              <th className="GestionComptesScreenSuiveur-th">Prénom</th>
              <th className="GestionComptesScreenSuiveur-th">Email</th>
              <th className="GestionComptesScreenSuiveur-th">Tags</th>
            </tr>
          </thead>
          <tbody className="GestionComptesScreenSuiveur-tbody">
            {filteredUsers.map((user) => (
              <React.Fragment key={user.id}>
                <tr onClick={() => handleToggleUserDetails(user.id!)} className={expandedUsers.includes(user.id!) ? 'expanded' : ''}>
                  <td className="GestionComptesScreenSuiveur-td">{user.lastname}</td>
                  <td className="GestionComptesScreenSuiveur-td">{user.name}</td>
                  <td className="GestionComptesScreenSuiveur-td">{user.email}</td>
                  <td className="GestionComptesScreenSuiveur-td">{Array.isArray(user.tag) ? user.tag.join(', ') : ''}</td>
                </tr>
                {expandedUsers.includes(user.id!) && (
                  <tr>
                    <td colSpan={4} className="GestionComptesScreenSuiveur-td">
                      <div>
                        <p><strong>Téléphone:</strong> {user.phone}</p>
                        <p><strong>Rôle:</strong> {user.role}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="GestionComptesScreenSuiveur-container">
      <h1 className="GestionComptesScreenSuiveur-title">Gestion des Comptes</h1>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="GestionComptesScreenSuiveur-search-bar"
      />
      {renderTableByRole('Alternants', alternants)}
      {renderTableByRole('Tuteurs', tuteurs)}
    </div>
  );
};

export default GestionComptesScreenSuiveur;
