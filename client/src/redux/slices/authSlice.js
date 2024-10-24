import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Thunk for registration
export const register = createAsyncThunk('auth/register', async (userData) => {
    const response = await authService.register(userData);
    localStorage.setItem('token', response.token);
    return response.user; // Assuming the response includes user details
  });


// Thunk for logging in
export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await authService.login(userData);
    localStorage.setItem('token', response.token); // Save token in localStorage
    return response.user;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Check if token exists on page load
const token = localStorage.getItem('token');

const initialState = {
  user: token ? authService.getUserFromToken(token) : null, // Set user if token exists
  isAuthenticated: !!token,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token'); // Remove token on logout
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;