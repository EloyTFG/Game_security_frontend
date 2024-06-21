import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/profile';
import { ThemeProvider, createTheme } from '@mui/material/styles';


import TopPlayers from './pages/topComponent';

import UserList from './pages/userList';
import EditUser from './pages/editUser';

import DesafioList from './pages/desafioList';
import EditDesafio from './pages/editDesafio';
import CreateChallenge from './pages/createChallenge';


import { AuthProvider } from './context/authContext';
import PhaseList from './pages/PhaseList';
import PhaseDetails from './pages/PhaseDetails';
import Challenge from './pages/challengeDetail';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
    <AuthProvider>
      <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update" element={<Profile />} />

 
          <Route path="/TopPlayers" element={<TopPlayers />} />


          <Route path="/fases" element={<PhaseList />} />
          <Route path="/fase/:id_fase" element={<PhaseDetails />} />
          <Route path="/challenge/:id_desafio" element={<Challenge />} />

  
          <Route path="/user-list" element={<UserList />} />
          <Route path="/edit-user/:id" element={<EditUser />} />

          <Route path="/challenge-list" element={<DesafioList />} />
          <Route path="/edit-challenge/:id" element={<EditDesafio />} />
          <Route path="/create-challenge" element={<CreateChallenge />} />

    
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;