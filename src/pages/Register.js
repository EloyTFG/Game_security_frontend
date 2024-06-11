import React, { useState } from 'react';
import AuthService from '../services/authServices';

const Register = () => {
  const [nombre_completo, setNombreCompleto] = useState('');
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [fecha_nacimiento, setFechaNacimiento] = useState('');
  const [correo_electronico, setCorreoElectronico] = useState('');
  const [contraseña, setPassword] = useState('');
  const [id_rol, setIdRol] = useState(2);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await AuthService.register(nombre_completo, nombre_usuario, fecha_nacimiento, correo_electronico, contraseña, id_rol);
      // Redirigir a la página principal o mostrar un mensaje
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input type="text" value={nombre_completo} onChange={(e) => setNombreCompleto(e.target.value)} placeholder="Nombre Completo" />
        <input type="text" value={nombre_usuario} onChange={(e) => setNombreUsuario(e.target.value)} placeholder="Nombre de Usuario" />
        <input type="date" value={fecha_nacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
        <input type="email" value={correo_electronico} onChange={(e) => setCorreoElectronico(e.target.value)} placeholder="Correo Electrónico" />
        <input type="password" value={contraseña} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
