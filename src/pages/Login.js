import React, { useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import VantaComponent from '../components/netComponet';

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

export default function SignInSide() {
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contraseña, setContraseña] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ correo_electronico: correoElectronico, contraseña });
      navigate('/'); 
    } catch (error) {
      console.error('Login error:', error.message || 'Error al iniciar sesión.');
      alert('Error al iniciar sesión: ' + (error.message || 'Intenta nuevamente.'));
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ position: 'relative', height: '100vh' }}>
        <CssBaseline />
        {/* Coloca VantaComponent para que ocupe todo el fondo */}
        <Box sx={{ position: 'fixed', width: '100%', height: '100%', zIndex: -1 }}>
          <VantaComponent />
        </Box>
        <Grid
          container
          component="main"
          sx={{
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
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
                Sign in
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={correoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
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
                    },
                    "& .MuiInputBase-input": {
                      color: "white", 
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
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
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
                    },
                    "& .MuiInputBase-input": {
                      color: "white", 
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
                  Sign In
                </Button>
                <Grid container>
                 
                  <Grid item>
                    <Link href="/register/" variant="body2" sx={{ color: 'white' }}>
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5, color: 'white' }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
