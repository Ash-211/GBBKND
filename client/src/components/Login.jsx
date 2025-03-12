import React, { useState } from 'react';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Login successful!');

      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred during login');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={credentials.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input name="password" type="password" value={credentials.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
