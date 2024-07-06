import axios from "axios";
import { IUser } from "../interfaces/IUsers";
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

    async getUser(token: string) {
        try {
            const response = await axios.get(`${URL_API}/api/users/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    async getUserById(id: number, token: string) {
        try{
            const response = await axios.get(`${URL_API}/api/users/users/${id}`, {
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

    async login(user: any) {
        try {
            const response = await axios.post(`${URL_API}/api/auth/login`, user);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    async getAllUsers(token: string) {
        try {
            const response = await axios.get(`${URL_API}/api/users/users`, {
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

    async createUser(user: any, token: any) {
        try {
            const response = await axios.post(`${URL_API}/api/users/users/`, user, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log(response);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    

    async updateUser(user: IUser, userId :any , token: string) {
        try {
            const response = await axios.put(`${URL_API}/api/users/users/${userId}`, user, {
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

    async deleteUser(userId: any, token: string) {
        try {
            const response = await axios.delete(`${URL_API}/api/users/users/${userId}`, {
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
    async updatePassword(newPassword: string, oldPassword:string , userId: any, token: string) {
        console.log(newPassword, oldPassword, userId, token);
        try {
            const response = await axios.put(`${URL_API}/api/users/users/${userId}/password`, {newPassword, oldPassword: oldPassword}, {
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

    async getDuoWithSuiveurIdAndPeriodMeetingFalse (suiveurId: any, token: string) {
        try {
            const response = await axios.get(`${URL_API}/api/duos/duos/suiveur/${suiveurId}/trialPeriodMeeting`, {
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
    

export default UserService;