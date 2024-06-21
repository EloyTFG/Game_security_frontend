import React, { useContext, useState, useEffect } from 'react';
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
import VantaComponent from '../components/netComponet'; 
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const defaultTheme = createTheme();

export default function Profile() {
  const { user,  login } = useContext(AuthContext);
 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    nombre_completo: '',
    nombre_usuario: '',
    correo_electronico: '',
    contraseña: '',
    currentPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        nombre_completo: user.nombre_completo || '',
        nombre_usuario: user.nombre_usuario || '',
        correo_electronico: user.correo_electronico || '',
        contraseña: '',
        currentPassword: '',
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
        delete updatedData.contraseña;
      }

      const response = await axios.put('http://localhost:5000/api/users/update', updatedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const { token, user: updatedUser } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      login({
        correo_electronico: updatedUser.correo_electronico,
        contraseña: updatedData.contraseña || formData.currentPassword,
      });
      navigate('/');
      

    } catch (error) {
      console.error('Update error:', error.message || 'Error updating profile.');
      alert('Error updating profile: ' + (error.message || 'Please try again.'));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ position: 'relative', height: '100vh' }}>
        <CssBaseline />
        <Box sx={{ position: 'fixed', width: '100%', height: '100%', zIndex: -1 }}>
          <VantaComponent />
        </Box>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              p: 4,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <IconButton color="primary" onClick={() => navigate(-1)} aria-label="back">
                  <ArrowBackIcon />
                </IconButton>
                
              </Box>
              
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
              
            <Typography component="h1" variant="h5" sx={{ color: 'white' }}>
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiOutlinedInput-input::placeholder": { color: "white" },
                      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": { color: "white" },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiOutlinedInput-input::placeholder": { color: "white" },
                      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": { color: "white" },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiOutlinedInput-input::placeholder": { color: "white" },
                      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": { color: "white" },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiOutlinedInput-input::placeholder": { color: "white" },
                      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": { color: "white" },
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiOutlinedInput-input::placeholder": { color: "white" },
                      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": { color: "white" },
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  "&.MuiButton-containedPrimary": {
                    backgroundColor: "primary.main",
                  },
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                Update Profile
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
