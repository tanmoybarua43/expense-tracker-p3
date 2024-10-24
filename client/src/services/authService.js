import axios from "axios";

const API_URL = "http://localhost:5050/api/auth/";

const login = async (userData) => {
  const response = await axios.post(`${API_URL}login`, userData);
  console.log("response data", response.data);
  return response.data; // Assuming response data includes both token and user info
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData);
  return response.data;
};

export default { login, register };
