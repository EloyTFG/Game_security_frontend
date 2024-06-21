import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container, CircularProgress,IconButton } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import ButtonAppBar from '../components/header';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PhaseDetails = () => {
  const { id_fase } = useParams();
  const [fase, setFase] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/fases/${id_fase}`);
        setFase(response.data);
      } catch (error) {
        console.error(`Error fetching data:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [id_fase]);

  const renderStars = (nivel_dificultad) => {
    return '⭐'.repeat(nivel_dificultad);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!fase) {
    return <Typography variant="h6">Fase no encontrada</Typography>;
  }

  return (
    <div id='fases'>
      <ButtonAppBar />
      <Container>
      <IconButton color="primary" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
        <Typography variant="h3" gutterBottom>
          {fase.nombre_fase}
        </Typography>
        <List>
          {fase.Desafios.map((desafio, index) => (
            <ListItem id='list-item'
              key={desafio.id_desafio} 
              divider
              component={Link} 
              to={`/challenge/${desafio.id_desafio}`}
              button 
            >
              <ListItemText
                primary={`Desafío ${index + 1}`}
                secondary={`Nivel de dificultad: ${renderStars(desafio.nivel_dificultad)}`}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </div>
  );
};

export default PhaseDetails;