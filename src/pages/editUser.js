import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, CircularProgress, Typography } from '@mui/material';

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ id_usuario: id, nombre_completo: '', nombre_usuario: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin-api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
        setFormData({
          id_usuario: id, 
          nombre_completo: response.data.nombre_completo,
          nombre_usuario: response.data.nombre_usuario,
        });
      } catch (error) {
        setError('Error fetching user. Please try again.');
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre_completo || !formData.nombre_usuario) {
      setError('All fields are required.');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/admin-api/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/user-list');
    } catch (error) {
      setError('Error updating user. Please try again.');
      console.error('Error updating user:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <h1>Editar Usuario</h1>
      {error && (
        <Typography color="error">{error}</Typography>
      )}
      {user && (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre Completo"
            value={formData.nombre_completo}
            onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Nombre de Usuario"
            value={formData.nombre_usuario}
            onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">Actualizar</Button>
        </form>
      )}
    </Container>
  );
};

export default EditUser;
