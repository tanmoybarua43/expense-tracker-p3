const express = require("express");
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Route to add an expense
router.post("/add", authMiddleware, addExpense);

// Route to fetch expenses for the logged-in user
router.get("/", authMiddleware, getExpenses);

// Route to update an expense by ID
router.put("/:id", authMiddleware, updateExpense);

// Route to delete an expense by ID
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
