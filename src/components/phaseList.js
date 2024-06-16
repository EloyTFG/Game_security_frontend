import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container, CircularProgress,IconButton, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ButtonAppBar from './header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const PhaseList = () => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/fases`);
        setPhases(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhases();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div id='fases'>
    <ButtonAppBar/>
    <Container>
    <IconButton color="primary" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
      <Typography variant="h3" gutterBottom>
        Lista de Fases
      </Typography>
      <List>
        {phases.map((fase) => (
          <ListItem id='list-item'
            key={fase.id_fase}
            divider
            button
            onClick={() => navigate(`/fase/${fase.id_fase}`)}
          >
            <ListItemText 
              primary={fase.nombre_fase}
              secondary={`Vulnerabilidad: ${fase.vulnerabilidad}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
    </div>);
};

export default PhaseList;