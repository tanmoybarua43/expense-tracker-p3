import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBudgetData,
  updateBudgetData,
  deleteBudgetData,
  fetchBudgetData,
} from "../../redux/slices/budgetSlice";
import { Alert } from "react-bootstrap";

const Budget = () => {
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budget);
  const userId = useSelector((state) => state.auth.user.id); // Get user ID
  const [amount, setAmount] = useState(budget.amount || 0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBudgetDataFromAPI = async () => {
      try {
        await dispatch(fetchBudgetData()).unwrap();
      } catch (err) {
        setError("Failed to fetch budget.");
      }
    };

    fetchBudgetDataFromAPI();
  }, [dispatch]);

  const handleSetBudget = async () => {
    const userId = "12345"; // Fetch or derive the user ID appropriately
    console.log("Setting budget for user ID:", userId);

    if (amount <= 0) {
      setError("Budget must be a positive number.");
      return;
    }

    setError("");
    try {
      const response = await dispatch(
        setBudgetData({ amount }, userId)
      ).unwrap();
      console.log("Budget set response:", response);
      setSuccess(true);
    } catch (error) {
      console.error("Error setting budget:", error);
      setError("Failed to set budget. Please try again.");
    }
  };

  const handleUpdateBudget = async () => {
    if (amount <= 0) {
      setError("Budget must be a positive number.");
      return;
    }
    setError("");
    try {
      await dispatch(updateBudgetData({ amount, userId })).unwrap();
      setSuccess(true);
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update budget. Please try again.");
    }
  };

  const handleDeleteBudget = async () => {
    if (window.confirm("Are you sure you want to delete the budget?")) {
      try {
        await dispatch(deleteBudgetData()).unwrap();
        setAmount(0);
        setSuccess(true);
      } catch (error) {
        setError("Failed to delete budget. Please try again.");
      }
    }
  };

  return (
    <div className="budget-container">
      <h2>{isEditing ? "Edit Budget" : "Set Monthly Budget"}</h2>
      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Budget saved successfully!
        </Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter budget amount"
        className="form-control mb-3"
      />
      <div className="buttons">
        {!isEditing ? (
          <>
            <button onClick={handleSetBudget} className="btn btn-primary">
              Set Budget
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-warning"
            >
              Edit Budget
            </button>
          </>
        ) : (
          <>
            <button onClick={handleUpdateBudget} className="btn btn-success">
              Update Budget
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </>
        )}
        <button onClick={handleDeleteBudget} className="btn btn-danger">
          Delete Budget
        </button>
      </div>
      <h3>Current Budget: ${budget.amount}</h3>
      <h4>Spent: ${budget.spent}</h4>
    </div>
  );
};

export default Budget;
