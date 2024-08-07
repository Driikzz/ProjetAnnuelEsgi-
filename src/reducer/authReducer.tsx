// features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('token'), // Initialiser avec le token du localStorage
    error: null as string | null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload); // Stocke le token dans le localStorage
        },
        clearToken: (state) => {
            state.token = null;
            localStorage.removeItem('token'); // Supprime le token du localStorage
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setToken, clearToken, setError, clearError } = authSlice.actions;

export default authSlice.reducer;
