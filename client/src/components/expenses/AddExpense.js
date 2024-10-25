import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addExpense,
  updateExpense,
  fetchExpenses,
} from "../../redux/slices/expenseSlice";
import { Alert } from "react-bootstrap";

const AddExpense = ({ expenseToEdit, onClose }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

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
      setAmount("");
      setCategory("");
      setDate("");
      setDescription("");
    }
  }, [expenseToEdit]);

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

      setAmount("");
      setCategory("");
      setDate("");
      setDescription("");
      setSuccess(true);
      if (onClose) onClose();

      // Refresh the expense list
      await dispatch(fetchExpenses()).unwrap();
    } catch (err) {
      setError("Failed to save expense. Please try again.");
    }
  };

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
    </div>
  );
};

export default AddExpense;
