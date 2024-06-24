// /src/components/EditUser.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ButtonAppBar from '../components/header';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
    <div id="challenge">
      <ButtonAppBar />
      <Container>
        <IconButton color="primary" onClick={() => navigate(-1)} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Editar Usuario
        </Typography>
        {error && (
          <Typography color="error">{error}</Typography>
        )}
        {user && (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre Completo"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleInputChange}
              fullWidth
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                  marginLeft: "80px",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                  marginLeft: "80px",
                },
                "& .MuiOutlinedInput-input": {
                  "&::placeholder": {
                    color: "white",
                  },
                },
                "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                  color: "white",
                },
              }}
            />
            <TextField
              label="Nombre de Usuario"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleInputChange}
              fullWidth
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white",
                  marginLeft: "80px",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                  marginLeft: "80px",
                },
                "& .MuiOutlinedInput-input": {
                  "&::placeholder": {
                    color: "white",
                  },
                },
                "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                  color: "white",
                },
              }}
            />
            <Button type="submit" variant="contained" color="primary" id="boton-enviar">
              Actualizar
            </Button>
          </form>
        )}
      </Container>
    </div>
  );
};

export default EditUser;
