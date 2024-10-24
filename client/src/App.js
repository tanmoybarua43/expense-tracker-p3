import 'bootstrap/dist/css/bootstrap.min.css'; // Keep the Bootstrap import
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute.js'; // Keep PublicRoute import
import Budget from './components/budget/Budget'; // Keep Budget import

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes (login, register) wrapped in PublicRoute */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Private routes (dashboard) wrapped in PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
