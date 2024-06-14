import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ButtonAppBar from './header';
import AuthContext from '../context/authContext'; // Importa el contexto de autenticación

const Transition = React.forwardRef(function Transition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Challenge = () => {
  const { id_desafio } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSolution, setUserSolution] = useState('');
  const [visibleHints, setVisibleHints] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [hintAvailable, setHintAvailable] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0); // Contador de tiempo
  const [intervalId, setIntervalId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useContext(AuthContext); // Accede al contexto de autenticación para obtener el usuario actual

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/challenge/${id_desafio}`);
        setChallenge(response.data);
      } catch (error) {
        console.error('Error fetching challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id_desafio]);

  useEffect(() => {
    if (!hintAvailable) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setHintAvailable(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hintAvailable]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    setIntervalId(timerId);

    return () => clearInterval(timerId);
  }, []);

  const handleSubmit = async () => {
    if (challenge && userSolution.trim().toLowerCase() === challenge.solucion_desafio.trim().toLowerCase()) {
      setShowAnswer(true);
      clearInterval(intervalId);

      const baseScore = 10000;
      const penaltyPerSecond = 10;
      const score = Math.max(0, baseScore - (timeSpent * penaltyPerSecond));

      const progressData = {
        id_usuario: user.id, // Utiliza la ID del usuario del contexto
        id_desafio: id_desafio,
        puntuacion: score,
        tiempo_invertido: new Date(timeSpent * 1000).toISOString().substr(11, 8)
      };

      try {
        await axios.post('http://localhost:5000/api/progreso', progressData);
        setDialogOpen(true); // Abre el diálogo
      } catch (error) {
        console.error('Error enviando el progreso:', error);
      }
    } else {
      alert('Incorrect solution. Try again.');
    }
  };

  const handleShowHint = () => {
    if (hintAvailable && visibleHints < challenge.Pista.length) {
      setVisibleHints((prev) => prev + 1);
      setHintAvailable(false);
      setTimeLeft(10); // Reset timer for the next hint
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleAgree = () => {
    // Lógica para mostrar información de prevención o redirigir a otra página
    console.log("Información de prevención seleccionada");
    setDialogOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!challenge) {
    return <Typography variant="h6">Challenge not found</Typography>;
  }

  return (
    <Container>
      <ButtonAppBar />
      <Typography variant="h4" gutterBottom>
        Desafío
      </Typography>
      <Typography 
        variant="h6" 
        gutterBottom
        dangerouslySetInnerHTML={{ __html: challenge.descripcion_desafio.replace(/\n/g, '<br />') }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Tu respuesta"
        value={userSolution}
        onChange={(e) => setUserSolution(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      {showAnswer && (
        <Typography variant="body1" sx={{ mt: 2, color: 'green' }}>
          ¡Respuesta correcta!
        </Typography>
      )}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Pistas</Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Pistas disponibles</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {challenge.Pista.slice(0, visibleHints).map((pista, index) => (
                <ListItem key={pista.id_pista}>
                  <ListItemText primary={`Pista ${index + 1}: ${pista.informacion_pista}`} />
                  {index < challenge.Pista.length - 1 && (
                    <IconButton
                      onClick={handleShowHint}
                      disabled={!hintAvailable || index >= visibleHints - 1}
                      sx={{
                        opacity: hintAvailable && index === visibleHints - 1 ? 1 : 0.5,
                      }}
                    >
                      <NavigateNextIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))}
            </List>
            {visibleHints < challenge.Pista.length && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  color={hintAvailable ? "secondary" : "primary"}
                  onClick={handleShowHint}
                  disabled={!hintAvailable}
                  sx={{ mr: 2 }}
                >
                  Mostrar Pista
                </Button>
                <Typography variant="body2">
                  {hintAvailable ? "¡Pista disponible!" : `Tiempo restante para la siguiente pista: ${timeLeft} segundos`}
                </Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Diálogo de confirmación */}
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Desafío completado"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            ¡Has completado el desafío y tu progreso ha sido guardado! ¿Quieres recibir información sobre cómo prevenir ataques similares en el futuro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleAgree}>Sí</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Challenge;
