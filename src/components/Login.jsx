import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const { login, setToken: setAuthToken} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(setAuthToken);

    try {
      if (token && !username && !password) {
        // If only a JWT token is provided, directly use it for login
        setAuthToken(token);
      } else {
        // If username and/or password are provided, use them for login
        await login(username, password);
      }

      navigate('/');
    } catch (error) {
      console.error(error.message);
      setError('Failed to login. Please check your credentials.');
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    // Clear token when username changes
    setToken('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear token when password changes
    setToken('');
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
    // Clear username and password when token changes
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <div><p>Supply Your Own Token:</p></div>
        <label htmlFor="token">JWT Token:</label>
        <input
          type="text"
          id="token"
          value={token}
          onChange={handleTokenChange}
          disabled={username || password}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;