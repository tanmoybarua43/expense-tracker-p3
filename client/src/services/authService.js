import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5050/api/auth/';

const login = async (userData) => {
  const response = await axios.post(`${API_URL}login`, userData);
  return response.data; // Assuming response data includes both token and user info
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData);
  return response.data;
};
// Helper function to get user from token
const getUserFromToken = (token) => {
  if (!token) return null;
  const decoded = jwtDecode(token);
  return {
    id: decoded.id,
    email: decoded.email, // Ensure the token contains email
    username: decoded.username, // Ensure the token contains username
  };
};

// export default { login, register, getUserFromToken };
// Assign the exported object to a variable
const authService = {
  login,
  register,
  getUserFromToken,
};

// Explicitly export the variable
export default authService;
