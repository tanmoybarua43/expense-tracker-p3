import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../../redux/slices/expenseSlice';
import { Alert } from 'react-bootstrap';

const AddExpense = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const expenseStatus = useSelector((state) => state.expenses.status);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await dispatch(addExpense({ amount, category, date, description })).unwrap();
      setAmount('');
      setCategory('');
      setDate('');
      setDescription('');
      setSuccess(true);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    }
  };
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="container mt-4">
      <h2>Add Expense</h2>
      {success && <Alert variant="success" onClose={() => setShow(false)} dismissible>Expense added successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit} className="mt-3">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control mb-3" placeholder="Amount" required />
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="form-control mb-3" placeholder="Category" required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-control mb-3" required />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control mb-3" placeholder="Description" />
        <button type="submit" className="btn btn-success w-100">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
