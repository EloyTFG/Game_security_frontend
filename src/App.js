import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChallengeList from './components/challengeList';
import ChallengebrokenList from './components/challengebrokenList';
import SqlInjectionChallenge from './pages/SqlInjectionChallenge';
import SqlInjectionChallenge2 from './pages/SqlInjectionChallenge2';
import BrokenAccessControlChallenge from './pages/BrokenAccessControlChallenge';

import { AuthProvider } from './context/authContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/challenges" element={<ChallengeList />} />
          <Route path="/challengesbroken" element={<ChallengebrokenList />} />
          <Route path="/sql-injection-1" element={<SqlInjectionChallenge />} />
          <Route path="/sql-injection-2" element={<SqlInjectionChallenge2 />} />
          <Route path="/broken-access-control" element={<BrokenAccessControlChallenge />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
