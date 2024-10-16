import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, deleteExpense } from '../../redux/slices/expenseSlice';
import { Button } from 'react-bootstrap';

const ExpenseList = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.items);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleDelete = (expenseId) => {
    dispatch(deleteExpense(expenseId));
  };

  const handleEdit = (expense) => {
    // Open edit modal or redirect to an edit page with the expense data
    console.log('Editing expense:', expense);
  };

  return (
    <div className="container mt-4">
      <h2 className='text-center'>Expense List</h2>
      <table className="table table-striped table-bordered table-hover mt-3">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col">Amount ($)</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <tr key={expense._id}>
                <th scope="row">{index + 1}</th>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>{expense.amount.toFixed(2)}</td>
                <td className='d-flex'>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(expense)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(expense._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No expenses to display</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
