interface IUser {
    id: number;
    name: string;
    email: string;
    age?: number;
    isAdmin: boolean;
}

export default IUser;