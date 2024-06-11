import React, { useContext } from 'react';
import AuthContext from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewChallenges = () => {
    navigate('/challenges');
  };

  const phases = [
    { id: 1, name: 'Inyecciones SQL', path: '/challenges' },
    // Puedes agregar más fases aquí si es necesario
  ];

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Home Page</h1>
      {user ? (
        <>
          <p>Welcome back! You are logged in.</p>
          <button onClick={handleLogout} style={{ padding: '10px 20px', margin: '10px' }}>Logout</button>
          <h2>Lista de Fases</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {phases.map((phase) => (
              <li key={phase.id} style={{ margin: '20px' }}>
                <button
                  onClick={() => navigate(phase.path)}
                  style={{ padding: '10px 20px' }}
                >
                  {phase.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p>Please login or register to continue.</p>
          <div style={{ margin: '20px' }}>
            <button onClick={handleLogin} style={{ padding: '10px 20px', margin: '10px' }}>Login</button>
            <button onClick={handleRegister} style={{ padding: '10px 20px', margin: '10px' }}>Register</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
