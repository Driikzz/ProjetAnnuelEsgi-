// features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    token: null as string | null,
    error: null as string | null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = null;
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
