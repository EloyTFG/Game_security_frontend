import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

const register = (nombre_completo, nombre_usuario, fecha_nacimiento, correo_electronico, contraseña, id_rol) => {
  return axios.post(API_URL + 'register', { nombre_completo, nombre_usuario, fecha_nacimiento, correo_electronico, contraseña, id_rol });
};

const login = (correo_electronico, contraseña) => {
  return axios.post(API_URL + 'login', { correo_electronico, contraseña })
    .then(response => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  logout
};
