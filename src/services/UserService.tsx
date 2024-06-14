import axios from "axios";

let URL_API = 'http://localhost:3000';


const UserService = {
    async getProfile() {
        const response = await fetch(`${URL_API}/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        });
        return response.json();
    },

    async getUsers() {
        try {
            const response = await axios.get(`${URL_API}/api/users/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log("token", localStorage.getItem('token'));
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    

   async createUser(user: any) {
        try{
            const response = await axios.post(`${URL_API}/users`, user);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    async login(user: any) {
        try {
            const response = await axios.post(`${URL_API}/api/auth/login`, user);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
    },
};
    

export default UserService;