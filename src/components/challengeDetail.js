import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
  Slide,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ButtonAppBar from "./header";
import AuthContext from "../context/authContext"; // Importa el contexto de autenticación

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Challenge = () => {
  const { id_desafio } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSolution, setUserSolution] = useState("");
  const [visibleHints, setVisibleHints] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [hintAvailable, setHintAvailable] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0); // Contador de tiempo
  const [intervalId, setIntervalId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useContext(AuthContext); // Accede al contexto de autenticación para obtener el usuario actual
  const navigate = useNavigate();
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [choices, setChoices] = useState([]);
  const [correctChoice, setCorrectChoice] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");

  // Estado para manejar documentos de prevención (ahora es de prevención)
  const [documentosPrevencion, setDocumentosPrevencion] = useState([]);
  const [prevencionDialogOpen, setPrevencionDialogOpen] = useState(false);
  const [currentPrevencionIndex, setCurrentPrevencionIndex] = useState(0);

  // Estado para manejar documentos de ayuda (ahora es de ayuda)
  const [documentosAyuda, setDocumentosAyuda] = useState([]);
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/challenge/${id_desafio}`
        );
        setChallenge(response.data);

        // Check if the solution contains &
        if (response.data.solucion_desafio.includes('&')) {
          const solutions = response.data.solucion_desafio.split('&').map(sol => sol.trim());
          setCorrectChoice(solutions[0]);
          setChoices(shuffleArray(solutions));
          setIsMultipleChoice(true);
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
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
    if (isMultipleChoice) {
      if (selectedChoice.toLowerCase() === correctChoice.toLowerCase()) {
        setShowAnswer(true);
        clearInterval(intervalId);
        handleProgress();
      } else {
        alert("Incorrect solution. Try again.");
      }
    } else {
      const possibleSolutions = challenge.solucion_desafio
        .split(',')
        .map(solution => solution.trim().toLowerCase());

      if (possibleSolutions.includes(userSolution.trim().toLowerCase())) {
        setShowAnswer(true);
        clearInterval(intervalId);
        handleProgress();
      } else {
        alert("Incorrect solution. Try again.");
      }
    }
  };

  const handleProgress = async () => {
    const baseScore = 10000;
    const penaltyPerSecond = 10;
    const score = Math.max(0, baseScore - timeSpent * penaltyPerSecond);

    const progressData = {
      id_usuario: user.id, // Utiliza la ID del usuario del contexto
      id_desafio: id_desafio,
      puntuacion: score,
      tiempo_invertido: new Date(timeSpent * 1000)
        .toISOString()
        .substr(11, 8),
    };

    try {
      await axios.post(`http://localhost:5000/api/progreso`, progressData);
      setDialogOpen(true); // Abre el diálogo
    } catch (error) {
      console.error("Error enviando el progreso:", error);
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

  const handleAgree = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/desafio/${id_desafio}/documentosprevencion`
      );
      setDocumentosPrevencion(response.data); // Cambia a prevención
      setPrevencionDialogOpen(true); // Abre el diálogo de documentos de prevención
    } catch (error) {
      console.error("Error fetching DocumentoPrevencion:", error);
    }
    setDialogOpen(false);
  };

  const handlePrevencionDialogClose = () => {
    setPrevencionDialogOpen(false);
  };

  const handleNextPrevencionDoc = () => {
    if (currentPrevencionIndex < documentosPrevencion.length - 1) {
      setCurrentPrevencionIndex(currentPrevencionIndex + 1);
    }
  };

  const handlePrevPrevencionDoc = () => {
    if (currentPrevencionIndex > 0) {
      setCurrentPrevencionIndex(currentPrevencionIndex - 1);
    }
  };

  // Funciones para manejar el diálogo de documentos de ayuda
  const handleDocDialogOpen = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/desafio/${id_desafio}/documentosayuda`
      );
      setDocumentosAyuda(response.data);
      setDocDialogOpen(true);
    } catch (error) {
      console.error("Error fetching DocumentoAyuda:", error);
    }
  };

  const handleDocDialogClose = () => {
    setDocDialogOpen(false);
  };

  const handleNextDoc = () => {
    if (currentDocIndex < documentosAyuda.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1);
    }
  };

  const handlePrevDoc = () => {
    if (currentDocIndex > 0) {
      setCurrentDocIndex(currentDocIndex - 1);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!challenge) {
    return <Typography variant="h6">Challenge not found</Typography>;
  }

  return (
    <div id="challenge">
      <ButtonAppBar />
      <IconButton color="primary" onClick={() => navigate(-1)} aria-label="back">
        <ArrowBackIcon />
      </IconButton>
      <Container>
      <Button
          variant="contained"
          color="secondary"
          onClick={handleDocDialogOpen} // Cambia a documentos de ayuda
          sx={{ mt: 4 }}
        >
          Ver Documentos de Ayuda
        </Button>
        <Typography variant="h3" gutterBottom>
          Desafío
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          dangerouslySetInnerHTML={{
            __html: challenge.descripcion_desafio.replace(/\n/g, "<br />"),
          }}
        />
        {isMultipleChoice ? (
          <FormControl fullWidth sx={{
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
                  marginLeft: "80px",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                  marginLeft: "80px",
                },
                "& .MuiOutlinedInput-input": {
                  "&::placeholder": {
                    color: "white",
                  },
                },
                "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                  color: "white",
                  
                  
                },
              }}>
            <InputLabel id="select-label" sx={{ color: 'white' }}>Selecciona la respuesta correcta</InputLabel>
            <Select
              labelId="select-label"
              value={selectedChoice}
              onChange={(e) => setSelectedChoice(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white", // Borde por defecto blanco
                  },
                  "&:hover fieldset": {
                    borderColor: "white", // Borde blanco al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white", // Borde blanco cuando está enfocado
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white", // Color del texto del label
                },
                "& .MuiInputBase-input": {
                  color: "white", // Color del texto de entrada
                },
                "& .MuiOutlinedInput-input": {
                  "&::placeholder": {
                    color: "white", // Color del placeholder
                  },
                },
                "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                  color: "white", // Color del label flotante (cuando se eleva)
                },
              }}
            >
              {choices.map((choice, index) => (
                <MenuItem key={index} value={choice} sx={{ color: 'white' }}>
                  {choice}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            id="user-solution"
            variant="outlined"
            label="Tu respuesta"
            value={userSolution}
            onChange={(e) => setUserSolution(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white", // Borde por defecto blanco
                },
                "&:hover fieldset": {
                  borderColor: "white", // Borde blanco al pasar el mouse
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white", // Borde blanco cuando está enfocado
                },
              },
              "& .MuiInputLabel-root": {
                color: "white", // Color del texto del label
                marginLeft: "80px", // Añade un margen izquierdo al label
              },
              "& .MuiInputBase-input": {
                color: "white", // Color del texto de entrada
                marginLeft: "80px",
              },
              "& .MuiOutlinedInput-input": {
                "&::placeholder": {
                  color: "white", // Color del placeholder
                },
              },
              "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                color: "white", // Color del label flotante (cuando se eleva)
              },
            }}
          />
        )}
        <Button variant="contained" color="primary" onClick={handleSubmit} id="boton-enviar">
          Enviar
        </Button>
        {showAnswer && (
          <Typography variant="h6" sx={{ mt: 2, color: "green" }}>
            ¡Respuesta correcta!
          </Typography>
        )}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4">Pistas</Typography>
          <Accordion id="acordeon">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />} // Flecha blanca
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Pistas disponibles</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {challenge.Pista.slice(0, visibleHints).map((pista, index) => (
                  <ListItem key={pista.id_pista}>
                    <ListItemText
                      primary={`Pista ${index + 1}: ${pista.informacion_pista}`}
                    />
                    {index < challenge.Pista.length - 1 && (
                      <IconButton
                        onClick={handleShowHint}
                        disabled={!hintAvailable || index >= visibleHints - 1}
                        sx={{
                          opacity:
                            hintAvailable && index === visibleHints - 1
                              ? 1
                              : 0.5,
                        }}
                      >
                        <NavigateNextIcon />
                      </IconButton>
                    )}
                  </ListItem>
                ))}
              </List>
              {visibleHints < challenge.Pista.length && (
                <Box
                  sx={{ display: "flex", alignItems: "center", mt: 2 }}
                  id="pista"
                >
                  <Button
                    variant="contained"
                    color={hintAvailable ? "secondary" : "primary"}
                    onClick={handleShowHint}
                    disabled={!hintAvailable}
                    sx={{
                      mr: 2,
                      borderColor: hintAvailable ? "" : "white", // Borde blanco antes de que esté disponible
                      borderWidth: hintAvailable ? "" : "1px",
                      borderStyle: hintAvailable ? "" : "solid",
                    }}
                  >
                    Mostrar Pista
                  </Button>
                  <Typography variant="body2">
                    {hintAvailable
                      ? "¡Pista disponible!"
                      : `Tiempo restante para la siguiente pista: ${timeLeft} segundos`}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>

        

        <Dialog
          open={dialogOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo oscuro para mejor contraste
              color: 'white', // Cambiar el color del texto a blanco
            },
          }}
        >
          <DialogTitle sx={{ color: 'white' }}>
            {"Desafío completado"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" sx={{ color: 'white' }}>
              ¡Has completado el desafío y tu progreso ha sido guardado!
              ¿Quieres recibir información sobre cómo prevenir ataques similares
              en el futuro?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: 'white' }}>
              No
            </Button>
            <Button onClick={handleAgree} sx={{ color: 'white' }}>
              Sí
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={docDialogOpen} // Dialog para documentos de ayuda
          TransitionComponent={Transition}
          keepMounted
          onClose={handleDocDialogClose}
          aria-describedby="documento-ayuda-description"
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo oscuro para mejor contraste
              color: 'white', // Cambiar el color del texto a blanco
            },
          }}
        >
          <DialogTitle sx={{ color: 'white' }}>
            {"Documento de Ayuda"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="documento-ayuda-description" sx={{ color: 'white' }}>
              {documentosAyuda[currentDocIndex]?.informacion_vulnerabilidad}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePrevDoc} sx={{ color: 'white' }} disabled={currentDocIndex === 0}>
              Anterior
            </Button>
            <Button onClick={handleNextDoc} sx={{ color: 'white' }} disabled={currentDocIndex === documentosAyuda.length - 1}>
              Siguiente
            </Button>
            <Button onClick={handleDocDialogClose} sx={{ color: 'white' }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={prevencionDialogOpen} // Dialog para documentos de prevención
          TransitionComponent={Transition}
          keepMounted
          onClose={handlePrevencionDialogClose}
          aria-describedby="documento-prevencion-description"
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo oscuro para mejor contraste
              color: 'white', // Cambiar el color del texto a blanco
            },
          }}
        >
          <DialogTitle sx={{ color: 'white' }}>
            {"Documento de Prevención"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="documento-prevencion-description" sx={{ color: 'white' }}>
              {documentosPrevencion[currentPrevencionIndex]?.informacion_prevencion}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePrevPrevencionDoc} sx={{ color: 'white' }} disabled={currentPrevencionIndex === 0}>
              Anterior
            </Button>
            <Button onClick={handleNextPrevencionDoc} sx={{ color: 'white' }} disabled={currentPrevencionIndex === documentosPrevencion.length - 1}>
              Siguiente
            </Button>
            <Button onClick={handlePrevencionDialogClose} sx={{ color: 'white' }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

// Función para barajar array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default Challenge;
