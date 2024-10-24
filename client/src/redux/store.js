import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import expenseReducer from "./slices/expenseSlice";
import budgetReducer from "./slices/budgetSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    budget: budgetReducer,
  },
  // No need to add thunk explicitly as it's included by default
});

export default store;
