import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Box, CircularProgress, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import ButtonAppBar from '../components/header';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.id_rol !== 1) {
      navigate('/login');
      return;
    }

    const fetchChallenges = async () => {
      if (!user.token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/admin-api/challenges', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setChallenges(response.data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [user, navigate]);

  const handleEdit = (id) => {
    navigate(`/edit-challenge/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin-api/delete-challenge/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setChallenges(challenges.filter((challenge) => challenge.id_desafio !== id));
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  const handleCreateChallenge = () => {
    navigate('/create-challenge');
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div id='challenge'>
      <ButtonAppBar />
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton color="primary" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <h1>Lista de Desafíos</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateChallenge}
          >
            Crear Desafío
          </Button>
        </Box>
        {challenges.map((challenge, index) => (
          <Accordion key={challenge.id_desafio}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${challenge.id_desafio}-content`}
              id={`panel-${challenge.id_desafio}-header`}
            >
              <Typography variant="h6">Desafío {index + 1}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="h6"><strong>Descripción:</strong> {challenge.descripcion_desafio}</Typography>
                <Typography variant="h6"><strong>Solución:</strong> {challenge.solucion_desafio}</Typography>
                <Typography variant="h6"><strong>Dificultad:</strong> {challenge.nivel_dificultad}</Typography>
                <Typography variant="h6"><strong>ID Fase:</strong> {challenge.id_fase}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton sx={{ color: 'white' }} onClick={() => handleEdit(challenge.id_desafio)}><EditIcon /></IconButton>
                  <IconButton sx={{ color: 'white' }} onClick={() => handleDelete(challenge.id_desafio)}><DeleteIcon /></IconButton>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Pistas</Typography>
                  <List>
                    {challenge.Pista && challenge.Pista.length > 0 ? (
                      challenge.Pista.map((pista, index) => (
                        <ListItem key={pista.id_pista}>
                          <ListItemText primary={
                            <Typography variant="h6"> Pista {index + 1}: {pista.informacion_pista} </Typography>
                          } />
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="h6">No hay pistas disponibles.</Typography>
                    )}
                  </List>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Documentos de Ayuda</Typography>
                  <List>
                    {challenge.DocumentoAyudas && challenge.DocumentoAyudas.length > 0 ? (
                      challenge.DocumentoAyudas.map((doc, index) => (
                        <ListItem key={doc.id_documento}>
                          <ListItemText primary={
                            <Typography variant="h6"> Documento {index + 1}: {doc.informacion_vulnerabilidad} </Typography>
                          } />
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="h6">No hay documentos de ayuda disponibles.</Typography>
                    )}
                  </List>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Documentos de Prevención</Typography>
                  <List>
                    {challenge.DocumentoPrevencions && challenge.DocumentoPrevencions.length > 0 ? (
                      challenge.DocumentoPrevencions.map((doc, index) => (
                        <ListItem key={doc.id_prevencion}>
                          <ListItemText primary={
                            <Typography variant="h6"> Documento {index + 1}: {doc.informacion_prevencion} </Typography>
                          } />
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="h6">No hay documentos de prevención disponibles.</Typography>
                    )}
                  </List>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </div>
  );
};

export default ChallengeList;
