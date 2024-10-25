import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import expenseService from '../../services/expenseService';

// Thunk to handle adding an expense
export const addExpense = createAsyncThunk('expenses/add', async (expenseData, { rejectWithValue }) => {
  try {
    const response = await expenseService.addExpense(expenseData);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk to handle fetching all expenses
export const fetchExpenses = createAsyncThunk('expenses/fetch', async () => {
  const response = await expenseService.getAllExpenses();
  return response;
});

// Thunk for updating an expense
export const updateExpense = createAsyncThunk('expenses/update', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await expenseService.updateExpense(id, updatedData);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk to handle deleting an expense
// export const deleteExpense = createAsyncThunk('expenses/delete', async (expenseId, { rejectWithValue }) => {
//   try {
//     await expenseService.deleteExpense(expenseId);
//     return expenseId; // Return the ID of the deleted expense
//   } catch (error) {
//     return rejectWithValue(error.response.data);
//   }
// });

export const deleteExpense = createAsyncThunk('expenses/delete', async (id, { rejectWithValue }) => {
  try {
    await expenseService.deleteExpense(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});



const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.push(action.payload); // Add the new expense to the state
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add expense';
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(expense => expense._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload; // Update the expense in the state
        }
      })
      // .addCase(deleteExpense.fulfilled, (state, action) => {
      //   state.items = state.items.filter(expense => expense._id !== action.payload); // Remove the deleted expense
      // });
      .addCase(deleteExpense.fulfilled, (state, action) => {
        // Remove the deleted expense from the state immediately
        state.items = state.items.filter(expense => expense._id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete expense';
      });
  },
});


export default expenseSlice.reducer;
