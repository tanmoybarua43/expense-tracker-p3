const express = require('express');
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Define routes with appropriate callback functions
router.get('/', authMiddleware, getExpenses);
router.post('/add', authMiddleware, addExpense);
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;
