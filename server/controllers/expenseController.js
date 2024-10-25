const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;
  try {
    const expense = await Expense.create({
      userId: req.user._id, // Assuming the user ID is available in req.user
      amount,
      category,
      date,
      description,
    });
    res.status(201).json(expense);
    console.log(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    // Log the user ID to check if it's being passed correctly
    console.log("User ID:", req.user._id);

    const expenses = await Expense.find({ userId: req.user._id }); // Fetch expenses for the logged-in user
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error); // Log the error if something goes wrong
    res.status(500).json({ message: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  const { id } = req.params; // Get the expense ID from the request parameters
  const { amount, category, date, description } = req.body;

  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user._id }, // Ensure the expense belongs to the logged-in user
      { amount, category, date, description },
      { new: true } // Return the updated expense
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params; // Get the expense ID from the request parameters

  try {
    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user._id, // Ensure the expense belongs to the logged-in user
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(204).send(); // No content to return on successful deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
