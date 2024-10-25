import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExpense } from '../../redux/slices/expenseSlice';
import { Alert } from 'react-bootstrap';

const predefinedCategories = ['Food', 'Transport', 'Entertainment', 'Health']; // Predefined categories

const AddExpense = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(''); // For custom category
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Use custom category if provided, otherwise use the selected category
    const finalCategory = customCategory ? customCategory : category;

    try {
      await dispatch(addExpense({ amount, category: finalCategory, date, description })).unwrap();
      setAmount('');
      setCategory('');
      setCustomCategory(''); // Reset custom category
      setDate('');
      setDescription('');
      setSuccess(true);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    }
  };

  return (
    <div className="container expense-list mt-4">
      <h2>Add Expense</h2>
      {success && <Alert variant="success">Expense added successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit} className="mt-3">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control mb-3" placeholder="Amount" required />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control mb-3" required>
          <option value="">Select Category</option>
          {predefinedCategories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
          <option value="custom">Other (Add Custom Category)</option>
        </select>

        {/* If user selects "Other", show input for custom category */}
        {category === 'custom' && (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="form-control mb-3"
            placeholder="Enter custom category"
            required
          />
        )}

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-control mb-3" required />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control mb-3" placeholder="Description" />
        <button type="submit" className="btn btn-success w-100">Add Expense</button>  
      </form>
    </div>
  );
};

export default AddExpense;

