import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, updateExpense, fetchExpenses } from "../../redux/slices/expenseSlice";
import { Alert } from "react-bootstrap";
import axios from "axios";

const predefinedCategories = ['Food', 'Transport', 'Entertainment', 'Health']; // Predefined categories

const AddExpense = ({ expenseToEdit, onClose }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState(""); // For custom category
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [remainingBalance, setRemainingBalance] = useState(0); // For budget balance

  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budget.amount); // Get current budget from state
  const expenses = useSelector((state) => state.expenses.items || []); // Get expenses from state

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount);
      setCategory(expenseToEdit.category);
      const formattedDate = new Date(expenseToEdit.date).toISOString().split("T")[0];
      setDate(formattedDate);
      setDescription(expenseToEdit.description);
    } else {
      resetForm();
    }
  }, [expenseToEdit]);

  useEffect(() => {
    fetchRemainingBudget(); // Fetch remaining budget on component mount or when expenses change
  }, [expenses]);

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setCustomCategory(""); // Reset custom category
    setDate("");
    setDescription("");
  };

  const fetchRemainingBudget = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5050/api/budget/remaining", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRemainingBalance(response.data.remainingBalance); // Set remaining balance after fetching
    } catch (error) {
      console.error("Error fetching remaining budget:", error); // Handle budget fetch error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const finalCategory = customCategory ? customCategory : category; // Use custom category if provided

    try {
      const expenseData = {
        amount: Number(amount),
        category: finalCategory,
        description,
      };

      if (expenseToEdit) {
        await dispatch(updateExpense({
          id: expenseToEdit._id,
          ...expenseData,
          date: expenseToEdit.date,
        })).unwrap();
      } else {
        await dispatch(addExpense({ ...expenseData, date })).unwrap();
      }

      resetForm();
      setSuccess(true);
      if (onClose) onClose();

      // Refresh the expense list and update budget balance after adding/updating expense
      await dispatch(fetchExpenses()).unwrap();
      fetchRemainingBudget(); // Update remaining budget after expense action
    } catch (err) {
      setError("Failed to save expense. Please try again.");
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0); // Calculate total of all expenses

  // Update remaining balance based on current budget and total expenses
  useEffect(() => {
    const Remainingbal = budget - totalExpenses; // Calculate remaining budget
    setRemainingBalance(Remainingbal); // Set the remaining balance
  }, [budget, totalExpenses]); // Update when budget or total expenses change

  return (
    <div className="container mt-4">
      <h2>{expenseToEdit ? "Edit Expense" : "Add Expense"}</h2>
      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Expense saved successfully!
        </Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit} className="mt-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-control mb-3"
          placeholder="Amount"
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control mb-3" required>
          <option value="">Select Category</option>
          {predefinedCategories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
          <option value="custom">Other (Add Custom Category)</option>
        </select>

        {/* If user selects "Other", show input for custom category */}
        {category === 'custom' && (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="form-control mb-3"
            placeholder="Enter custom category"
            required
          />
        )}

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-control mb-3"
          required
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control mb-3"
          placeholder="Description"
        />

        <button type="submit" className="btn btn-success w-100">
          {expenseToEdit ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      <div className="mt-4">
        <h3>Current Budget: ${budget}</h3> {/* Display current budget */}
        <h3>Total Expenses: ${totalExpenses}</h3> {/* Display total expenses */}
        <h3>Remaining Balance: ${remainingBalance}</h3> {/* Display remaining balance */}
      </div>
    </div>
  );
};

export default AddExpense;
