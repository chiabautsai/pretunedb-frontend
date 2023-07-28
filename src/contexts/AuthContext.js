import React, { createContext, useState, useEffect, useContext } from 'react';
import { ApiContext } from '../contexts/ApiContext';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { apiUrlBase:API_URL_BASE } = useContext(ApiContext);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      localStorage.setItem('token', token);
    } else {
      setIsLoggedIn(false);
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Server Error');
    }
    return data;
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(API_URL_BASE + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await handleResponse(response);
      setToken(data.token);
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await fetch(API_URL_BASE + '/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await handleResponse(response);
      console.log(data.message);

      // You can redirect the user to a verification page here if needed

    } catch (error) {
      throw error;
    }
  };

  const verify = async (verificationCode) => {
    try {
      const response = await fetch(API_URL_BASE + '/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode }),
      });

      const data = await handleResponse(response);
      console.log(data.message);

      // You can redirect the user to a success page here if needed

    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
  };

  const authContextValue = { token, isLoggedIn, setToken, login, register, verify, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;