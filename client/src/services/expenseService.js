import axios from 'axios';

const API_URL = 'http://localhost:5050/api/expenses/';

const addExpense = async (expenseData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}add`, expenseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Function to update an expense
const updateExpense = async (id, updatedData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` }, // Ensure you're passing the token if using auth
  });
  return response.data;
};



const deleteExpense = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getAllExpenses = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const expenseService = {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense
};

export default expenseService;
