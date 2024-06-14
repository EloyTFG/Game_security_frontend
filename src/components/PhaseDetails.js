import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container, CircularProgress } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import ButtonAppBar from './header';

const PhaseDetails = () => {
  const { id_fase } = useParams();
  const [fase, setFase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/fases/${id_fase}`);
        setFase(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [id_fase]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!fase) {
    return <Typography variant="h6">Fase no encontrada</Typography>;
  }

  return (
    <>
      <ButtonAppBar />
      <Container>
        <Typography variant="h4" gutterBottom>
          {fase.nombre_fase}
        </Typography>
        <List>
          {fase.Desafios.map((desafio, index) => (
            <ListItem 
              key={desafio.id_desafio} 
              divider
              component={Link} 
              to={`/challenge/${desafio.id_desafio}`}
              button // Añade esta propiedad para que el `ListItem` sea clickeable
            >
              <ListItemText
                primary={`Desafío ${index + 1}`}
                secondary={`Nivel de dificultad: ${desafio.nivel_dificultad}`}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
};

export default PhaseDetails;
