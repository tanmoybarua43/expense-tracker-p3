const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;
  try {
    const expense = await Expense.create({
      userId: req.user._id,  // Assuming the user ID is available in req.user
      amount,
      category,
      date,
      description,
    });
    res.status(201).json(expense);
    console.log(expense)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
