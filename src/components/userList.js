import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Box, CircularProgress, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import ButtonAppBar from './header'; // Asumiendo que el componente de la barra de navegación se llama header
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Obtiene el usuario autenticado
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.id_rol !== 1) {
      navigate('/login'); // Redirige a la página de login si no es admin
      return;
    }

    const fetchUsers = async () => {
      if (!user.token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/admin-api/users', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin-api/delete/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(users.filter((user) => user.id_usuario !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCreateChallenge = () => {
    navigate('/challenge-list');
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
        <Typography variant="h3" gutterBottom sx={{ color: 'white' }}>
          Lista de Usuarios
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
         
          <Button
         id='btn-jugar'
           color="primary"
           variant="contained"
           size="large"
           component="a"
           onClick={handleCreateChallenge}
           sx={{ minWidth: 150 }}
         >
           Desafíos
         </Button>
        </Box>
        <Table sx={{ border: '1px solid white' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }}>ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Nombre Completo</TableCell>
              <TableCell sx={{ color: 'white' }}>Nombre de Usuario</TableCell>
              <TableCell sx={{ color: 'white' }}>Correo Electrónico</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id_usuario} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#23153c' } }}>
                <TableCell sx={{ color: 'white' }}>{user.id_usuario}</TableCell>
                <TableCell sx={{ color: 'white' }}>{user.nombre_completo}</TableCell>
                <TableCell sx={{ color: 'white' }}>{user.nombre_usuario}</TableCell>
                <TableCell sx={{ color: 'white' }}>{user.correo_electronico}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user.id_usuario)}><EditIcon sx={{ color: 'white' }} /></IconButton>
                  <IconButton onClick={() => handleDelete(user.id_usuario)}><DeleteIcon sx={{ color: 'white' }} /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </div>
  );
};

export default UserList;
