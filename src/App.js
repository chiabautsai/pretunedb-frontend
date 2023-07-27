import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import RecordsList from './components/RecordsList';
import RecordDetails from './components/RecordDetails';
import ClicksList from './components/ClicksList';
import Register from './components/Register';
import Login from './components/Login';
import Verify from './components/Verify';

const App = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/records">Records</Link>
            </li>
            <li>
              <Link to="/clicks">Clicks</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/register">Register</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/records" element={<RecordsList />} />
          <Route path="/records/:id" element={<RecordDetails />} />
          <Route path="/clicks" element={<ClicksList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;