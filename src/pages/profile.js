import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import axios from 'axios';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const defaultTheme = createTheme();

export default function Profile() {
  const { user, setUser, login } = useContext(AuthContext);
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    nombre_completo: '',
    nombre_usuario: '',
    correo_electronico: '',
    contraseña: '',
    currentPassword: '', // Contraseña actual requerida para la verificación
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        nombre_completo: user.nombre_completo || '',
        nombre_usuario: user.nombre_usuario || '',
        correo_electronico: user.correo_electronico || '',
        contraseña: '',
        currentPassword: '', // Inicializar la contraseña actual vacía
      });
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.currentPassword) {
      alert('Please provide your current password to update the profile.');
      return;
    }
    try {
      const updatedData = { ...formData };
      if (!updatedData.contraseña) {
        delete updatedData.contraseña; // No enviar contraseña si está vacía
      }

      const response = await axios.put('http://localhost:5000/api/users/update', updatedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const { token, user: updatedUser } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      // Reautenticar al usuario
      login({
        correo_electronico: updatedUser.correo_electronico,
        contraseña: updatedData.contraseña || formData.currentPassword,
      });
      navigate('/');
      setUser({ token, ...updatedUser });
      
    } catch (error) {
      
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="nombre_completo"
                  required
                  fullWidth
                  id="nombre_completo"
                  label="Full Name"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="nombre_usuario"
                  label="Username"
                  name="nombre_usuario"
                  value={formData.nombre_usuario}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="correo_electronico"
                  label="Email Address"
                  name="correo_electronico"
                  autoComplete="email"
                  value={formData.correo_electronico}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="contraseña"
                  label="New Password (leave blank to keep current)"
                  type="password"
                  id="contraseña"
                  autoComplete="new-password"
                  value={formData.contraseña}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  id="currentPassword"
                  autoComplete="current-password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update Profile
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
