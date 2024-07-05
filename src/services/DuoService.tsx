import axios from "axios";

let URL_API = 'http://localhost:3000';

const DuoService = {
    async createDuo(duo: any, token: string) {
        try {
            const response = await axios.post(`${URL_API}/api/duos`, duo, {
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

    async getAllDuos(token: string) {
        try {
            const response = await axios.get(`${URL_API}/api/duos`, {
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

    async getDuoById(id: number, token: string) {
        try {
            const response = await axios.get(`${URL_API}/api/duos/${id}`, {
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

    async updateDuo(id: number, duo: any, token: string) {
        try {
            const response = await axios.put(`${URL_API}/api/duos/${id}`, duo, {
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

    async deleteDuo(id: number, token: string) {
        try {
            const response = await axios.delete(`${URL_API}/api/duos/${id}`, {
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

    async getDuosByUserId(id: number, token: string) {
        try {
            const response = await axios.get(`${URL_API}/api/duos/suiveur/${id}/duos`, {
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

export default DuoService;
