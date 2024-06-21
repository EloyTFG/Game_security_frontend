import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from '../context/authContext';
import ButtonAppBar from '../components/header';

const EditChallenge = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [challenge, setChallenge] = useState(null);
  const [formData, setFormData] = useState({
    id_desafio: id,
    descripcion_desafio: '',
    solucion_desafio: '',
    nivel_dificultad: '',
    id_fase: '',
    pistas: [],
    documentosAyuda: [],
    documentosPrevencion: [] 
  });
  const [fases, setFases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFases = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin-api/fases', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFases(response.data);
      } catch (error) {
        setError('Error fetching phases.');
        console.error(error);
      }
    };

    const fetchChallenge = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin-api/challenges/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setChallenge(response.data);
        setFormData({
          id_desafio: id,
          descripcion_desafio: response.data.descripcion_desafio,
          solucion_desafio: response.data.solucion_desafio,
          nivel_dificultad: response.data.nivel_dificultad,
          id_fase: response.data.id_fase,
          pistas: response.data.Pista.map((p) => p.informacion_pista),
          documentosAyuda: response.data.DocumentoAyudas.map((d) => d.informacion_vulnerabilidad),
          documentosPrevencion: response.data.DocumentoPrevencions.map((d) => d.informacion_prevencion) 
        });
      } catch (error) {
        setError('Error fetching challenge.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFases();
    fetchChallenge();
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddPista = () => {
    setFormData({
      ...formData,
      pistas: [...formData.pistas, '']
    });
  };

  const handlePistaChange = (index, value) => {
    const newPistas = formData.pistas.map((pista, i) => (i === index ? value : pista));
    setFormData({
      ...formData,
      pistas: newPistas
    });
  };

  const handleDeletePista = (index) => {
    const newPistas = formData.pistas.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      pistas: newPistas
    });
  };

  const handleAddDocumentoAyuda = () => {
    setFormData({
      ...formData,
      documentosAyuda: [...formData.documentosAyuda, '']
    });
  };

  const handleDocumentoAyudaChange = (index, value) => {
    const newDocumentosAyuda = formData.documentosAyuda.map((doc, i) => (i === index ? value : doc));
    setFormData({
      ...formData,
      documentosAyuda: newDocumentosAyuda
    });
  };

  const handleDeleteDocumentoAyuda = (index) => {
    const newDocumentosAyuda = formData.documentosAyuda.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      documentosAyuda: newDocumentosAyuda
    });
  };

  const handleAddDocumentoPrevencion = () => {
    setFormData({
      ...formData,
      documentosPrevencion: [...formData.documentosPrevencion, '']
    });
  };

  const handleDocumentoPrevencionChange = (index, value) => {
    const newDocumentosPrevencion = formData.documentosPrevencion.map((doc, i) => (i === index ? value : doc));
    setFormData({
      ...formData,
      documentosPrevencion: newDocumentosPrevencion
    });
  };

  const handleDeleteDocumentoPrevencion = (index) => {
    const newDocumentosPrevencion = formData.documentosPrevencion.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      documentosPrevencion: newDocumentosPrevencion
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/admin-api/update-challenge/${id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate('/challenge-list');
    } catch (error) {
      setError('Error updating challenge.');
      console.error(error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div id="challenge">
      <ButtonAppBar />
      <Container>
        <IconButton color="primary" onClick={() => navigate(-1)} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Editar Desafío
        </Typography>
        {error && (
          <Typography color="error">{error}</Typography>
        )}
        {challenge && (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Descripción del Desafío"
              name="descripcion_desafio"
              value={formData.descripcion_desafio}
              onChange={handleInputChange}
              fullWidth
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
              }}
            />
            <TextField
              label="Solución del Desafío"
              name="solucion_desafio"
              value={formData.solucion_desafio}
              onChange={handleInputChange}
              fullWidth
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
              }}
            />
            <TextField
              label="Nivel de Dificultad"
              name="nivel_dificultad"
              type="number"
              value={formData.nivel_dificultad}
              onChange={handleInputChange}
              fullWidth
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
              }}
            />
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
              <InputLabel id="fase-label">Fase</InputLabel>
              <Select
                labelId="fase-label"
                name="id_fase"
                value={formData.id_fase}
                onChange={handleInputChange}
                label="Fase"
              >
                {fases.map((fase) => (
                  <MenuItem key={fase.id_fase} value={fase.id_fase} sx={{ color: 'white' }}>
                    {fase.nombre_fase}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pistas
              </Typography>
              {formData.pistas.map((pista, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label={`Pista ${index + 1}`}
                    value={pista}
                    onChange={(e) => handlePistaChange(index, e.target.value)}
                    fullWidth
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
                    }}
                  />
                  <IconButton onClick={() => handleDeletePista(index)}>
                    <DeleteIcon sx={{ color: 'white' }} />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="contained"
                endIcon={<AddCircleIcon />}
                onClick={handleAddPista}
                id="boton-enviar"
              >
                Añadir Pista
              </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Documentos de Ayuda
              </Typography>
              {formData.documentosAyuda.map((doc, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label={`Documento de Ayuda ${index + 1}`}
                    value={doc}
                    onChange={(e) => handleDocumentoAyudaChange(index, e.target.value)}
                    fullWidth
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
                    }}
                  />
                  <IconButton onClick={() => handleDeleteDocumentoAyuda(index)}>
                    <DeleteIcon sx={{ color: 'white' }} />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="contained"
                endIcon={<AddCircleIcon />}
                onClick={handleAddDocumentoAyuda}
                id="boton-enviar"
              >
                Añadir Documento de Ayuda
              </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Documentos de Prevención
              </Typography>
              {formData.documentosPrevencion.map((doc, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label={`Documento de Prevención ${index + 1}`}
                    value={doc}
                    onChange={(e) => handleDocumentoPrevencionChange(index, e.target.value)}
                    fullWidth
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
                    }}
                  />
                  <IconButton onClick={() => handleDeleteDocumentoPrevencion(index)}>
                    <DeleteIcon sx={{ color: 'white' }} />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="contained"
                endIcon={<AddCircleIcon />}
                onClick={handleAddDocumentoPrevencion}
                id="boton-enviar"
              >
                Añadir Documento de Prevención
              </Button>
            </Box>

            <Button id="boton-enviar" type="submit" variant="contained" color="primary">
              Actualizar
            </Button>
          </form>
        )}
      </Container>
    </div>
  );
};

export default EditChallenge;
