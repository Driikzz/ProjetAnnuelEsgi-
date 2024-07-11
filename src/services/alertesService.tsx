import axios from 'axios';
import DuoService from './DuoService';
import UserService from './UserService';

const URL_API = 'http://localhost:3000/api/alertes';

const AlertesService = {
  async getAllAlertes(token: string) {
    try {
      const response = await axios.get(`${URL_API}/alertes`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const alertes = response.data;
      for (let alerte of alertes) {
        const duo = await DuoService.getDuoById(alerte.duoId, token);
        if (duo) {
          alerte.alternant = await UserService.getUserById(duo.idAlternant, token);
          alerte.suiveur = await UserService.getUserById(duo.idSuiveur, token);
          alerte.tuteur = await UserService.getUserById(duo.idTuteur, token);
        }
      }
      return alertes;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async getAlertesByType(type: string, token: string) {
    try {
      const response = await axios.get(`${URL_API}/alertes/type/${type}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async createAlerte(data: any, token: string) {
    try {
      const response = await axios.post(`${URL_API}/alertes`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  
  async traiterAlerte(id: number, token: string) {
    try {
      const response = await axios.put(`${URL_API}/alertes/${id}/traiter`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default AlertesService;
