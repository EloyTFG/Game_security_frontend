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
  const navigate = useNavigate(); 
  const [drawerOpen, setDrawerOpen] = useState(false); 

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
    handleDrawerClose(); 
    navigate('/update'); 
  };

  const getInitials = (name: string) => {
    const words = name.split(' ');
    const initials = words.map(word => word[0]).join('').toUpperCase();
    return initials.substring(0, 2); 
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {user && ( 
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleDrawerOpen} 
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
                backgroundColor: 'transparent', 
              },
            }}
          >
            <Typography variant="h6" component="div">
              Game Security
            </Typography>
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {user ? ( 
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 1 }}>
                {getInitials(user.nombre_usuario)}
              </Avatar>
              <Typography variant="h6" component="div">
                {user.nombre_usuario} 
              </Typography>
            </Box>
          ) : (
            <Button color="inherit" href="/login/">Login</Button> 
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
            {user?.id_rol === 1 && (
              <ListItem button onClick={() => navigate('/user-list')}>
                <ListItemText primary="Admin menu" />
              </ListItem>
            )}
            <ListItem button onClick={handleProfileClick}>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem button onClick={() => navigate('/TopPlayers')}>
              <ListItemText primary="Top players" />
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
