import React, { useState, useContext } from 'react';
import AuthContext from '../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [correo_electronico, setCorreoElectronico] = useState('');
  const [contraseña, setContraseña] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        correo_electronico,
        contraseña
      });
      login(response.data.token);
      navigate('/'); // Redirige al Home
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      // Mostrar mensaje de error al usuario
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={correo_electronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
