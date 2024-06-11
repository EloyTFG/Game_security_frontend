// SqlInjectionChallenge2.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SqlInjectionChallenge2 = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [dbName, setDbName] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  
  const fetchUsers = async (dbName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/challenges/users2/${dbName}`);
      setUsers(response.data.users);
    } catch (error) {
      setMessage('Error al obtener usuarios: ' + (error.response?.data?.message || error.message));
    }
  };

  const startChallenge = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/challenges/start-sql-injection2', {
        userId: 'test_user'
      });
      setDbName(response.data.dbName);
      setMessage(response.data.message);
      await fetchUsers(response.data.dbName); // Llamar a fetchUsers justo después de obtener dbName
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
      const response = await axios.post('http://localhost:5000/api/challenges/sql-injection2', {
        dbName,
        username,
        password
      });
      setMessage(response.data.message);
      if (response.data.message.includes('El desafío ha terminado')) {
        setDbName(null);
        setUsers([]); // Limpiar la lista de usuarios
      } else {
        await fetchUsers(dbName); // Actualizar la lista de usuarios después de enviar credenciales
      }
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
      const response = await axios.post('http://localhost:5000/api/challenges/end-sql-injection2', {
        dbName
      });
      setMessage(response.data.message);
      setDbName(null);
      setUsers([]); // Limpiar la lista de usuarios
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
            <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '50%' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>Username</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{user.id}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SqlInjectionChallenge2;
