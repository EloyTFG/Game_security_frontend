
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import PhaseDetails from '../../pages/PhaseDetails';
import AuthContext from '../../context/authContext';
import { useNavigate } from 'react-router-dom';


const mockAxios = new MockAdapter(axios);


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id_fase: '1',
  }),
  useNavigate: jest.fn(),
}));

describe('PhaseDetails Page', () => {
  const mockNavigate = jest.fn();
  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user, logout: jest.fn() }}>
        <Router>
          <PhaseDetails />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders loading indicator initially', () => {
    renderWithContext({ name: 'test', token: 'fake-token' });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays "Fase no encontrada" if phase is not found', async () => {
    mockAxios.onGet('http://localhost:5000/api/fases/1').reply(404);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByText('Fase no encontrada')).toBeInTheDocument();
    });
  });

  test('fetches and displays phase details', async () => {
    const mockData = {
      nombre_fase: 'Fase de Prueba',
      Desafios: [
        { id_desafio: 1, nivel_dificultad: 2 },
        { id_desafio: 2, nivel_dificultad: 3 },
      ],
    };
    mockAxios.onGet('http://localhost:5000/api/fases/1').reply(200, mockData);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByText('Fase de Prueba')).toBeInTheDocument();
      expect(screen.getByText('Desafío 1')).toBeInTheDocument();
      expect(screen.getByText('Desafío 2')).toBeInTheDocument();
      expect(screen.getByText('Nivel de dificultad: ⭐⭐')).toBeInTheDocument();
      expect(screen.getByText('Nivel de dificultad: ⭐⭐⭐')).toBeInTheDocument();
    });
  });

  test('navigates back on back button click', async () => {
    mockAxios.onGet('http://localhost:5000/api/fases/1').reply(200, {
      nombre_fase: 'Fase de Prueba',
      Desafios: [],
    });

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByText('Fase de Prueba')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
