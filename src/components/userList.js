import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Obtiene el usuario autenticado

  useEffect(() => {
    if (user?.id_rol !== 1) {
      navigate('/login');
    }
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin-api/users', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
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
    navigate('/create-challenge');
  };

  return (
    <Container>
      <h1>Lista de Usuarios</h1>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateChallenge}
        >
          Crear Desafío
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre Completo</TableCell>
            <TableCell>Nombre de Usuario</TableCell>
            <TableCell>Correo Electrónico</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id_usuario}>
              <TableCell>{user.id_usuario}</TableCell>
              <TableCell>{user.nombre_completo}</TableCell>
              <TableCell>{user.nombre_usuario}</TableCell>
              <TableCell>{user.correo_electronico}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(user.id_usuario)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(user.id_usuario)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default UserList;
