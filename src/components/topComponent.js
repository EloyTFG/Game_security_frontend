import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container, CircularProgress, Box } from '@mui/material';
import ButtonAppBar from './header';
import AuthContext from '../context/authContext';

const TopPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Obtener el usuario autenticado

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
    <>
      <ButtonAppBar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Top de Jugadores
        </Typography>
        <List>
          {players.map((player, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`${index + 1}. ${player.nombre_usuario}`}
                secondary={`Puntuación: ${player.progreso}`}
              />
            </ListItem>
          ))}
        </List>
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Usuario actual: {user ? `${user.nombre_usuario} (Puntuación: ${currentUserScore})` : 'Desconocido'}
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default TopPlayers;
