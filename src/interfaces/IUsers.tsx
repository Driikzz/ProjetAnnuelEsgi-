export interface IUser {
    id?: number;
    name: string;
    lastname: string;
    password: string;
    email: string;
    phone?: string;
    role: string;
    tag: string[];
    creationDate?: Date;
    modificationDate?: Date;
    lastConnection?: Date;
  }
export default IUser;