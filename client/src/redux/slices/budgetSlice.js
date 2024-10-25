// redux/slices/budgetSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import budgetService from "../../services/budgetService";

export const setBudgetData = createAsyncThunk(
  "budget/set",
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await budgetService.setBudget(budgetData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBudgetData = createAsyncThunk("budget/fetch", async () => {
  const response = await budgetService.fetchBudget();
  return response;
});

export const updateBudgetData = createAsyncThunk(
  "budget/update",
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await budgetService.updateBudget(budgetData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBudgetData = createAsyncThunk("budget/delete", async () => {
  await budgetService.deleteBudget();
});

const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    amount: 0,
    spent: 0,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgetData.fulfilled, (state, action) => {
        state.amount = action.payload.amount;
        state.spent = action.payload.spent; // Assuming you track spent in the budget model
      })
      .addCase(setBudgetData.fulfilled, (state, action) => {
        state.amount = action.payload.amount;
      })
      .addCase(updateBudgetData.fulfilled, (state, action) => {
        state.amount = action.payload.amount;
      })
      .addCase(deleteBudgetData.fulfilled, (state) => {
        state.amount = 0; // Reset budget amount on deletion
      })
      .addCase(setBudgetData.rejected, (state, action) => {
        state.error = action.payload || "Failed to set budget";
      });
  },
});

export default budgetSlice.reducer;
