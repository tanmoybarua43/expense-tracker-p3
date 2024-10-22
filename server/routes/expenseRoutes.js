const express = require('express');
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Define routes with appropriate callback functions
router.get('/', authMiddleware, getExpenses);
router.post('/add', authMiddleware, addExpense);
// Update an expense
router.put('/:id', authMiddleware, updateExpense); 
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;
