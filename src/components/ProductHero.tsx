import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ProductHeroLayout from './ProductHeroLayout';
import AuthContext from '../context/authContext';


export default function ProductHero() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundColor: '#7fc7d9',
        backgroundPosition: 'center',
      }}
    >
      <img
        style={{ display: 'none' }}
        src={backgroundImage}
        alt="increase priority"
      />
      <Typography color="inherit" align="center" variant="h2">
        Game Security
      </Typography>
      {user ? (
        <>
        <Typography variant="h5" color="inherit" align="center" sx={{ mt: 2 }}>
          Welcome, {user.nombre_usuario}!
        </Typography>
         <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
         <Button
         id='btn-jugar'
           color="primary"
           variant="contained"
           size="large"
           component="a"
           href="/fases/"
           sx={{ minWidth: 150 }}
         >
           Start playing
         </Button>
       </Box>
       </>
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              component="a"
              href="/register/"
              sx={{ minWidth: 150 }}
            >
              Register
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="large"
              component="a"
              href="/login/"
              sx={{ minWidth: 150 }}
            >
              Login
            </Button>
          </Box>
          <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
            Discover the experience
          </Typography>
        </>
      )}
    </ProductHeroLayout>
  );
}