import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, updateExpense, deleteExpense } from '../../redux/slices/expenseSlice';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

const ExpenseList = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.items);
  
  // State for modal visibility
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null); // Store the selected expense
  const [success, setSuccess] = useState(false);
  
  // Local state for form fields inside modal
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // Handle opening the modal and pre-filling the form with the selected expense's details
  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(new Date(expense.date).toISOString().substr(0, 10)); // Format date for input field
    setDescription(expense.description);
    setShowEditModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedExpense(null);
  };

  // Handle updating the expense
  const handleUpdateExpense = () => {
    if (selectedExpense) {
      const updatedData = { amount, category, date, description };
      dispatch(updateExpense({ id: selectedExpense._id, updatedData }))
        .then(() => {
          setShowEditModal(false);
          setSuccess(true); // Show success message
          setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
        })
        .catch(() => {
          // Handle error (optional)
        });
    }
  };

  const handleDelete = (expenseId) => {
    dispatch(deleteExpense(expenseId));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Expense List</h2>
      
      {success && <Alert variant="success">Expense updated successfully!</Alert>}

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
                <td className="d-flex">
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

      {/* Edit Expense Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formCategory" className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDate" className="mt-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateExpense}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExpenseList;
