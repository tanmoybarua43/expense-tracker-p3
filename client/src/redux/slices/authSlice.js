import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Thunk for registration
export const register = createAsyncThunk('auth/register', async (userData) => {
    const response = await authService.register(userData);
    localStorage.setItem('token', response.token);
    return response.user; // Assuming the response includes user details
  });


  export const login = createAsyncThunk('auth/login', async (userData) => {
    const response = await authService.login(userData);
    localStorage.setItem('token', response.token);
    return response.user; // Ensure the entire user object is returned
  });
  
  const authSlice = createSlice({
    name: 'auth',
    initialState: {
      user: null,
      isAuthenticated: false,
      status: 'idle',
    },
    reducers: {
      logout: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.fulfilled, (state, action) => {
          state.user = action.payload; // Set user details here
          state.isAuthenticated = true;
        });
    },
  });
  
  export const { logout } = authSlice.actions;
  export default authSlice.reducer;