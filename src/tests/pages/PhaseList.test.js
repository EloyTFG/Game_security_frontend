
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import PhaseList from '../../pages/PhaseList';
import AuthContext from '../../context/authContext';


const mockAxios = new MockAdapter(axios);


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('PhaseList Page', () => {
  const phasesData = [
    { id_fase: 1, nombre_fase: 'Fase 1', vulnerabilidad: 'Alta' },
    { id_fase: 2, nombre_fase: 'Fase 2', vulnerabilidad: 'Media' },
  ];

  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user, logout: jest.fn(), loading: false }}>
        <Router>
          <PhaseList />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('renders loading indicator initially', () => {
    renderWithContext({ name: 'test', token: 'fake-token' });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('fetches and displays phases data', async () => {
    mockAxios.onGet('http://localhost:5000/api/fases').reply(200, phasesData);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByText('Lista de Fases')).toBeInTheDocument();
      expect(screen.getByText('Fase 1')).toBeInTheDocument();
      expect(screen.getByText('Fase 2')).toBeInTheDocument();
    });
  });

  test('handles API fetch error', async () => {
    mockAxios.onGet('http://localhost:5000/api/fases').reply(500);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching data:',
        expect.anything()
      );
    });
  });

  test('navigates to phase detail on click', async () => {
    mockAxios.onGet('http://localhost:5000/api/fases').reply(200, phasesData);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByText('Fase 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Fase 1'));
    expect(mockNavigate).toHaveBeenCalledWith('/fase/1');
  });

  test('navigates back on back button click', async () => {
    mockAxios.onGet('http://localhost:5000/api/fases').reply(200, phasesData);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
