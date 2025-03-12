import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div>Welcome to the MVP! Please register or login.</div>} />
      </Routes>
    </Router>
  );
}

export default App;
