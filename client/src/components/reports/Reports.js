import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../../redux/slices/expenseSlice';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register the required components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Reports = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.items);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryTotals),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category', // Use 'category' for the x-axis scale type
        title: {
          display: true,
          text: 'Category',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount',
        },
      },
    },
  };

  return (
    <div>
      <h2>Spending Report</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Reports;
