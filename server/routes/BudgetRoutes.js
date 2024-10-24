const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

const authMiddleware = require("../middleware/authMiddleware");
router.use(authMiddleware);

// Set a new budget
router.post("/set", budgetController.setBudget);

// Update an existing budget
router.put("/update", budgetController.updateBudget);

// Delete the budget
router.delete("/delete", budgetController.deleteBudget);

// Fetch the current budget
router.get("/", budgetController.fetchBudget); // Changed to fetchBudget

router.get("/budget/remaining", budgetController.calculateRemainingBudget);

module.exports = router;
