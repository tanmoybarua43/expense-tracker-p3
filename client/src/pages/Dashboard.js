import React from 'react';
import { useSelector } from 'react-redux';
import AddExpense from '../components/expenses/AddExpense';
import ExpenseList from '../components/expenses/ExpenseList';
import Reports from '../components/reports/Reports';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      {user && <h2>Welcome, {user.username}!</h2>} {/* Display the username */}
      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <AddExpense />
        </div>
        <div className="col-md-6 mb-4">
          <ExpenseList />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Reports />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
