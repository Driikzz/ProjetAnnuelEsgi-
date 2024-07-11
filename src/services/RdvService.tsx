import axios from 'axios';
let URL_API = 'http://localhost:3000';

const rdvService = {
    async createRdv(rdv: any, token: string) {
        try {
            const response = await axios.post(`${URL_API}/api/rdv/rdv`, rdv, {
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
    async getRdvbySuiveurId(id: number, token: string) {
        try {
            const response = await axios.get(`${URL_API}/api/rdv/rdv/suiveur/${id}`, { 
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
    async cancelRdv(rdv:any, token: string) {
        try {
            const response = await axios.post(`${URL_API}/api/rdv/rdv/delete`, rdv, {
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
    async relance(id:any, token: string) {
        try {
            const response = await axios.get(`${URL_API}/api/rdv/rdv/relance/${id}`, { 
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

    async getDuoWithRdv(token: string, id :number) {
        try {
            const response = await axios.get(`${URL_API}/api/rdv/rdv/duo/${id}`, {  
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

    async getRdvByTutorId(id: number, token: string) {
        try {
            const response = await axios.get(`${URL_API}/api/rdv/rdv/tuteur/${id}`, {
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

export default rdvService;