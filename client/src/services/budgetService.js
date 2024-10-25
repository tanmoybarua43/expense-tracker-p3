// services/budgetService.js
import axios from "axios";

const API_URL = "http://localhost:5050/api/budget/";

const setBudget = async (budgetData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}set`, budgetData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchBudget = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateBudget = async (budgetData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}update`, budgetData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteBudget = async () => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}delete`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default { setBudget, fetchBudget, updateBudget, deleteBudget };
