import * as React from 'react';
import { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import VantaComponent from '../components/netComponet'; 
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        Game Security
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre_completo: '',
    nombre_usuario: '',
    correo_electronico: '',
    fecha_nacimiento: '',
    contraseña: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(formData);
      navigate('/'); 
    } catch (error) {
      console.error('Registration error:', error.message || 'Error al registrar.');
      alert('Error al registrar: ' + (error.message || 'Intenta nuevamente.'));
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
              Sign up
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
                    autoFocus
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
                    id="email"
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
                    required
                    fullWidth
                    id="fecha_nacimiento"
                    label="Date of Birth"
                    name="fecha_nacimiento"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formData.fecha_nacimiento}
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
                    name="contraseña"
                    label="Password"
                    type="password"
                    id="password"
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
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2" sx={{ color: 'white' }}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5, color: 'white' }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
