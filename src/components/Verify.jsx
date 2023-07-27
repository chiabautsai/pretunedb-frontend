import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Verify = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const { verify } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      await verify(verificationCode);
      navigate('/');
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Verify Account</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleVerify}>
        <label htmlFor="verificationCode">Verification Code:</label>
        <input
          type="text"
          id="verificationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default Verify;