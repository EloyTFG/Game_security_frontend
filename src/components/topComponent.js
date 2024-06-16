import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Box, CircularProgress, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import ButtonAppBar from './header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TopPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Obtener el usuario autenticado
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/top');
        // Ordenar jugadores por puntuación en orden descendente
        const sortedPlayers = response.data.sort((a, b) => b.progreso - a.progreso);
        setPlayers(sortedPlayers);
      } catch (error) {
        console.error('Error fetching top players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  // Encontrar la puntuación del usuario actual
  const currentUserScore = players.find(player => player.nombre_usuario === user?.nombre_usuario)?.progreso || 0;

  return (
    <div id="challenge">
      <ButtonAppBar />
      <Container>
        <IconButton color="primary" onClick={() => navigate(-1)} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h3" gutterBottom sx={{ color: 'white' }}>
          Top de Jugadores
        </Typography>
        <Table sx={{ border: '1px solid white' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }}>Posición</TableCell>
              <TableCell sx={{ color: 'white' }}>Nombre de Usuario</TableCell>
              <TableCell sx={{ color: 'white' }}>Puntuación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#23153c' } }}>
                <TableCell sx={{ color: 'white' }}>{index + 1}</TableCell>
                <TableCell sx={{ color: 'white' }}>{player.nombre_usuario}</TableCell>
                <TableCell sx={{ color: 'white' }}>{player.progreso}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box mt={4} sx={{ display: 'flex', justifyContent: 'center',  bgcolor: 'rgba(0, 0, 0, 0.8)', borderRadius: 2, border: '1px solid white'}}>
         
            <Typography variant="h4" sx={{ color: 'white' }}>
              {user?.nombre_usuario}
            </Typography>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              {currentUserScore}
            </Typography>
          
        </Box>
       
      </Container>
    </div>
  );
};

export default TopPlayers;
