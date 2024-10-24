import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpense,
  updateExpense,
  fetchExpenses,
} from "../../redux/slices/expenseSlice";
import { Alert } from "react-bootstrap";
import axios from "axios";

const AddExpense = ({ expenseToEdit, onClose }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [remainingBalance, setRemainingBalance] = useState(0);

  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budget.amount);
  const expenses = useSelector((state) => state.expenses.items || []);

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount);
      setCategory(expenseToEdit.category);
      const formattedDate = new Date(expenseToEdit.date)
        .toISOString()
        .split("T")[0];
      setDate(formattedDate);
      setDescription(expenseToEdit.description);
    } else {
      resetForm();
    }
  }, [expenseToEdit]);

  useEffect(() => {
    fetchRemainingBudget();
  }, [expenses]); // Fetch budget whenever expenses change

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
  };

  const fetchRemainingBudget = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:5050/api/budget/remaining",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRemainingBalance(response.data.remainingBalance);
    } catch (error) {
      console.error("Error fetching remaining budget:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const expenseData = {
        amount: Number(amount),
        category,
        description,
      };

      if (expenseToEdit) {
        await dispatch(
          updateExpense({
            id: expenseToEdit._id,
            ...expenseData,
            date: expenseToEdit.date,
          })
        ).unwrap();
      } else {
        await dispatch(addExpense({ ...expenseData, date })).unwrap();
      }

      resetForm();
      setSuccess(true);
      if (onClose) onClose();

      // Refresh the expense list
      await dispatch(fetchExpenses()).unwrap();
      fetchRemainingBudget(); // Update remaining balance after adding/updating expense
    } catch (err) {
      setError("Failed to save expense. Please try again.");
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Update remaining balance based on current budget and total expenses
  useEffect(() => {
    const Remainingbal = budget - totalExpenses;
    setRemainingBalance(Remainingbal);
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
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-control mb-3"
          placeholder="Category"
          required
        />
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
        <h3>Current Budget: ${budget}</h3>
        <h3>Total Expenses: ${totalExpenses}</h3>
        <h3>Remaining Balance: ${remainingBalance}</h3>
      </div>
    </div>
  );
};

export default AddExpense;
