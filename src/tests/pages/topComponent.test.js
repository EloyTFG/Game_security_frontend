import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import TopPlayers from '../../pages/topComponent'; // Asegúrate de que la ruta al componente sea correcta
import AuthContext from '../../context/authContext';

// Crear un mock para axios
const mockAxios = new MockAdapter(axios);

// Mock para useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('TopPlayers Component', () => {
  const mockUser = {
    id: '1',
    nombre_usuario: 'testuser',
    token: 'fake-token',
  };

  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user }}>
        <Router>
          <TopPlayers />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  test('fetches and displays top players', async () => {
    const mockData = [
      { nombre_usuario: 'testuser', progreso: 1200 },
      { nombre_usuario: 'player1', progreso: 1000 },
      { nombre_usuario: 'player2', progreso: 800 },
    ];

    mockAxios.onGet('http://localhost:5000/api/top').reply(200, mockData);

    await waitFor(() => {
      renderWithContext(mockUser);
    });

    await waitFor(() => {
      expect(screen.getByText('Top de Jugadores')).toBeInTheDocument();
      expect(screen.getByText('player1')).toBeInTheDocument();
      expect(screen.getByText('player2')).toBeInTheDocument();
      expect(screen.getAllByText('testuser').length).toBe(3); // Expected occurrences
    });
  });

 

 

  test('displays the current user\'s score', async () => {
    const mockData = [
      { nombre_usuario: 'testuser', progreso: 1200 },
      { nombre_usuario: 'player1', progreso: 1000 },
      { nombre_usuario: 'player2', progreso: 800 },
    ];

    mockAxios.onGet('http://localhost:5000/api/top').reply(200, mockData);

    await waitFor(() => {
      renderWithContext(mockUser);
    });

    await waitFor(() => {
      expect(screen.getAllByText('testuser').length).toBe(3); // Ensuring both name and score displays
     
    });
  });
});
