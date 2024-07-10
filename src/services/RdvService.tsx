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
};

export default rdvService;