import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import axios from 'axios';

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  fetchUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
    document.cookie = `session=${JSON.stringify(user)}; path=/`;
  };

  const logout = () => {
    setUser(null);
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
