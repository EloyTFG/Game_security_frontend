import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SqlInjectionChallenge = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [dbName, setDbName] = useState(null);
  const navigate = useNavigate();

  const startChallenge = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/challenges/start-sql-injection', {
        userId: 'test_user' // Puede ser el ID real del usuario si lo tienes
      });
      setDbName(response.data.dbName);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChallenge = async () => {
    if (!dbName) {
      setMessage('Debes iniciar el desafío primero');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/challenges/sql-injection', {
        dbName,
        username,
        password
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
      const response = await axios.post('http://localhost:5000/api/challenges/end-sql-injection', {
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
        await axios.post('http://localhost:5000/api/challenges/end-sql-injection', {
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
      <h1>SQL Injection Challenge</h1>
      <div style={{ margin: '20px' }}>
        {!dbName ? (
          <button onClick={startChallenge} style={{ padding: '10px 20px', margin: '10px' }}>Start Challenge</button>
        ) : (
          <>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ margin: '10px' }}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ margin: '10px' }}
              />
            </label>
            <br />
            <button onClick={handleChallenge} style={{ padding: '10px 20px', margin: '10px' }}>Submit</button>
            <button onClick={endChallenge} style={{ padding: '10px 20px', margin: '10px' }}>End Challenge</button>
            <button onClick={handleBack} style={{ padding: '10px 20px', margin: '10px' }}>Back</button>
          </>
        )}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SqlInjectionChallenge;
