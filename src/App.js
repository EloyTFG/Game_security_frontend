import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/profile';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import ChallengeList from './components/challengeList';
import ChallengebrokenList from './components/challengebrokenList';
import ChallengemimitList from './components/mitigacion';
import ChallengeListXSS from './components/challengeListinyectionxss';

import TopPlayers from './components/topComponent';




import UserList from './components/userList';
import EditUser from './components/editUser';

import DesafioList from './components/desafioList';
import EditDesafio from './components/editDesafio';
import CreateChallenge from './components/createChallenge';


import SqlInjectionChallenge from './pages/SqlInjectionChallenge';
import SqlInjectionChallenge2 from './pages/SqlInjectionChallenge2';
import BrokenAccessControlChallenge from './pages/BrokenAccessControlChallenge';
import XxeChallenge from './pages/XXEChallenge';

import Base64Challenge from './pages/Base64Challenge';

import HashChallenge from './pages/hashChallenge';

import XSSChallenge from './pages/XSSChallenge';

import { AuthProvider } from './context/authContext';
import PhaseList from './components/PhaseList';
import PhaseDetails from './components/PhaseDetails';
import Challenge from './components/challengeDetail';
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


          <Route path="/base64-challenge" element={<Base64Challenge />} />
          <Route path="/hash-challenge" element={<HashChallenge />} />
          <Route path="/TopPlayers" element={<TopPlayers />} />


          <Route path="/fases" element={<PhaseList />} />
          <Route path="/fase/:id_fase" element={<PhaseDetails />} />
          <Route path="/challenge/:id_desafio" element={<Challenge />} />

          <Route path="/challenges" element={<ChallengeList />} />
          <Route path="/challengesbroken" element={<ChallengebrokenList />} />
          <Route path="/challengemimit" element={<ChallengemimitList />} />
          <Route path="/challengeListinyectionxss" element={<ChallengeListXSS />} />

          <Route path="/user-list" element={<UserList />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
        

          <Route path="/challenge-list" element={<DesafioList />} />
          <Route path="/edit-challenge/:id" element={<EditDesafio />} />
          <Route path="/create-challenge" element={<CreateChallenge />} />





          <Route path="/XSSChallenge" element={<XSSChallenge />} />

          <Route
            path="/XSSChallenge2"
            element={() => {
              window.location.href = "/prueba.html";
              return null;
            }}/>
          <Route path="/sql-injection-1" element={<SqlInjectionChallenge />} />
          <Route path="/sql-injection-2" element={<SqlInjectionChallenge2 />} />
          <Route path="/broken-access-control" element={<BrokenAccessControlChallenge />} />
          <Route path="/xxeChallenge" element={<XxeChallenge />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;