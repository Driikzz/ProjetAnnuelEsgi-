import axios from "axios";
import { IEntreprise } from '../interfaces/IEntreprise';

let URL_API = 'http://localhost:3000';

const EntrepriseService = {
  async createEntreprise(entreprise: IEntreprise, token: string) {
    try {
      const response = await axios.post(`${URL_API}/api/entreprises`, entreprise, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getAllEntreprises(token: string) {
    try {
      const response = await axios.get(`${URL_API}/api/entreprises`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getEntrepriseById(id: number, token: string) {
    try {
      const response = await axios.get(`${URL_API}/api/entreprises/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateEntreprise(id: number, entreprise: IEntreprise, token: string) {
    try {
      const response = await axios.put(`${URL_API}/api/entreprises/${id}`, entreprise, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteEntreprise(id: number, token: string) {
    try {
      const response = await axios.delete(`${URL_API}/api/entreprises/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
};

export default EntrepriseService;
