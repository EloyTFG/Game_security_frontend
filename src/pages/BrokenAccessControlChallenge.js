// src/components/BrokenAccessControlChallenge.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BrokenAccessControlChallenge = () => {
  const [message, setMessage] = useState('');
  const [dbName, setDbName] = useState(null);
  const navigate = useNavigate();

  const startChallenge = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/challenges/start-broken-access-control', {
        userId: 'test_user'
      });
      setDbName(response.data.dbName);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const checkAccess = async (resource) => {
    if (!dbName) {
      setMessage('Debes iniciar el desafío primero');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/challenges/check-access', {
        dbName,
        resource
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const endChallenge = async () => {
    if (!dbName) {
      setMessage('No hay base de datos para eliminar');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/challenges/end-broken-access-control', {
        dbName
      });
      setMessage(response.data.message);
      setDbName(null);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleBack = async () => {
    if (dbName) {
      try {
        await axios.post('http://localhost:5000/api/challenges/end-broken-access-control', {
          dbName
        });
        setDbName(null);
      } catch (error) {
        setMessage('Error al eliminar la base de datos: ' + (error.response?.data?.message || error.message));
      }
    }
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Broken Access Control Challenge</h1>
      <div style={{ margin: '20px' }}>
        {!dbName ? (
          <button onClick={startChallenge} style={{ padding: '10px 20px', margin: '10px' }}>Start Challenge</button>
        ) : (
          <>
            <button onClick={() => checkAccess('admin_section')} style={{ padding: '10px 20px', margin: '10px' }}>Check Access to Admin Section</button>
            <button onClick={() => checkAccess('user_data')} style={{ padding: '10px 20px', margin: '10px' }}>Check Access to User Data</button>
            <button onClick={endChallenge} style={{ padding: '10px 20px', margin: '10px' }}>End Challenge</button>
            <button onClick={handleBack} style={{ padding: '10px 20px', margin: '10px' }}>Back</button>
          </>
        )}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BrokenAccessControlChallenge;
