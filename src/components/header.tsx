import * as React from 'react';
import { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AuthContext from '../context/authContext';

export default function ButtonAppBar() {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate(); // Hook para la navegación
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para el Drawer

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleProfileClick = () => {
    handleDrawerClose(); // Cierra el Drawer antes de navegar
    navigate('/update'); // Navega a la página de actualización
  };

  const getInitials = (name: string) => {
    const words = name.split(' ');
    const initials = words.map(word => word[0]).join('').toUpperCase();
    return initials.substring(0, 2); // Retorna las dos primeras letras
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {user && ( // Mostrar el botón del Drawer solo si el usuario está logueado
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleDrawerOpen} // Abre el Drawer al hacer clic
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
          <Button
            onClick={() => navigate('/')}
            sx={{
              color: 'inherit',
              textTransform: 'none',
              padding: 0,
              minWidth: 0,
              '&:hover': {
                backgroundColor: 'transparent', // Evita que se vea como un botón al hacer hover
              },
            }}
          >
            <Typography variant="h6" component="div">
              Game Security
            </Typography>
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {user ? ( // Si el usuario está logueado, muestra el nombre de usuario con Avatar
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 1 }}>
                {getInitials(user.nombre_usuario)} {/* Muestra las iniciales */}
              </Avatar>
              <Typography variant="h6" component="div">
                {user.nombre_usuario} {/* Muestra el nombre de usuario */}
              </Typography>
            </Box>
          ) : (
            <Button color="inherit" href="/login/">Login</Button> // Muestra "Login" si no hay usuario
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleDrawerClose}
          onKeyDown={handleDrawerClose}
        >
          <List>
            {/* Muestra el menú de administración solo si el usuario es un administrador */}
            {user?.id_rol === 1 && (
              <ListItem button onClick={() => navigate('/user-list')}>
                <ListItemText primary="Admin menu" />
              </ListItem>
            )}
            <ListItem button onClick={handleProfileClick}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => navigate('/TopPlayers')}>
              <ListItemText primary="My account" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>
    </Box>
  );
}
