// models/Budget.js
const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    spent: { type: Number, default: 0 }, // Optional: Track how much has been spent
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", BudgetSchema);
module.exports = Budget;
