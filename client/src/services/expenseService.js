import axios from 'axios';

const API_URL = 'http://localhost:5050/api/expenses/';

const addExpense = async (expenseData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}add`, expenseData, {
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

export default { addExpense, getAllExpenses };
