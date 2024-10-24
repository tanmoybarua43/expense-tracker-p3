import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import expenseService from "../../services/expenseService";

// Thunk to handle adding an expense
export const addExpense = createAsyncThunk(
  "expenses/add",
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await expenseService.addExpense(expenseData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to handle fetching all expenses
export const fetchExpenses = createAsyncThunk("expenses/fetch", async () => {
  const response = await expenseService.getAllExpenses();

  return response;
});

// Thunk to handle deleting an expense
export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (expenseId, { rejectWithValue }) => {
    try {
      await expenseService.deleteExpense(expenseId);
      return expenseId; // Return the ID of the deleted expense
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/update",
  async ({ id, ...expenseData }, { rejectWithValue }) => {
    try {
      const response = await expenseService.updateExpense(id, expenseData);
      return response; // Return the updated expense
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload); // Add the new expense to the state
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.error = action.payload || "Failed to add expense";
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (expense) => expense._id !== action.payload
        ); // Remove the deleted expense
      });
  },
});

export default expenseSlice.reducer;
