// controllers/budgetController.js
const Budget = require("../models/Budget");
exports.setBudget = async (req, res) => {
  const { amount } = req.body;
  try {
    const budget = await Budget.create({
      userId: req.user._id, // Use req.user to get the user ID
      amount,
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fetchBudget = async (req, res) => {
  console.log("req.user in fetchBudget:", req.user); // Log the entire req.user object
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user._id; // Should now be defined
  try {
    const budget = await Budget.findOne({ userId }); // Ensure you use userId correctly
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.status(200).json(budget);
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateBudget = async (req, res) => {
  const { amount } = req.body;

  try {
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id },
      { amount },
      { new: true } // Return the updated budget
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ userId: req.user._id });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(204).send(); // No content to return on successful deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Expense = require("../models/Expense");

exports.calculateRemainingBudget = async (req, res) => {
  const userId = req.user._id; // Get the logged-in user's ID

  try {
    // Fetch the budget for the user
    const budget = await Budget.findOne({ userId });
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Calculate total expenses for the user
    const totalExpenses = await Expense.aggregate([
      {
        $match: { userId: userId }, // Match expenses for the user
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum the amounts
        },
      },
    ]);

    const totalSpent = totalExpenses.length > 0 ? totalExpenses[0].total : 0;

    // Update the spent amount in the budget
    budget.spent = totalSpent;
    await budget.save();

    // Calculate remaining balance
    const remainingBalance = budget.amount - totalSpent;

    res.status(200).json({ remainingBalance, totalSpent });
  } catch (error) {
    console.error("Error calculating remaining budget:", error);
    res.status(500).json({ message: error.message });
  }
};
