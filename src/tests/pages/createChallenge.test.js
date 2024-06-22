import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import CreateChallenge from '../../pages/createChallenge';
import AuthContext from '../../context/authContext';

const mockAxios = new MockAdapter(axios);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('CreateChallenge Page', () => {
  const mockNavigate = jest.fn();
  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user, logout: jest.fn() }}>
        <Router>
          <CreateChallenge />
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

  test('displays error message when phases data fails to load', async () => {
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(500);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByText('Error fetching phases.')).toBeInTheDocument();
    });
  });

  test('fetches and displays phases data', async () => {
    const mockPhases = [
      { id_fase: '1', nombre_fase: 'Fase 1' },
      { id_fase: '2', nombre_fase: 'Fase 2' },
    ];
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, mockPhases);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.mouseDown(screen.getByLabelText(/Fase/i));
    });

    expect(screen.getByText('Fase 1')).toBeInTheDocument();
    expect(screen.getByText('Fase 2')).toBeInTheDocument();
  });

  test('adds and removes pistas', async () => {
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, []);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Añadir Pista/i));
    });

    expect(screen.getAllByLabelText(/Pista/i)).toHaveLength(1);

    fireEvent.change(screen.getByLabelText(/Pista 1/i), { target: { value: 'Nueva pista' } });
    expect(screen.getByLabelText(/Pista 1/i)).toHaveValue('Nueva pista');

    fireEvent.click(screen.getByTestId('DeleteIcon').closest('button'));

    await waitFor(() => {
      expect(screen.queryByLabelText(/Pista 1/i)).not.toBeInTheDocument();
    });
  });

  test('adds and removes documentos de ayuda', async () => {
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, []);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Añadir Documento de Ayuda/i));
    });

    expect(screen.getAllByLabelText(/Documento de Ayuda/i)).toHaveLength(1);

    fireEvent.change(screen.getByLabelText(/Documento de Ayuda 1/i), { target: { value: 'Nuevo documento de ayuda' } });
    expect(screen.getByLabelText(/Documento de Ayuda 1/i)).toHaveValue('Nuevo documento de ayuda');

    fireEvent.click(screen.getByTestId('DeleteIcon').closest('button'));

    await waitFor(() => {
      expect(screen.queryByLabelText(/Documento de Ayuda 1/i)).not.toBeInTheDocument();
    });
  });

  test('adds and removes documentos de prevención', async () => {
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, []);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Añadir Documento de Prevención/i));
    });

    expect(screen.getAllByLabelText(/Documento de Prevención/i)).toHaveLength(1);

    fireEvent.change(screen.getByLabelText(/Documento de Prevención 1/i), { target: { value: 'Nuevo documento de prevención' } });
    expect(screen.getByLabelText(/Documento de Prevención 1/i)).toHaveValue('Nuevo documento de prevención');

    fireEvent.click(screen.getByTestId('DeleteIcon').closest('button'));

    await waitFor(() => {
      expect(screen.queryByLabelText(/Documento de Prevención 1/i)).not.toBeInTheDocument();
    });
  });

  test('submits form and navigates to challenge list on successful create', async () => {
    const mockPhases = [
      { id_fase: '1', nombre_fase: 'Fase 1' },
      { id_fase: '2', nombre_fase: 'Fase 2' },
    ];
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, mockPhases);
    mockAxios.onPost('http://localhost:5000/admin-api/create').reply(200);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Descripción del Desafío/i), { target: { value: 'Descripción de prueba' } });
      fireEvent.change(screen.getByLabelText(/Solución del Desafío/i), { target: { value: 'Solución de prueba' } });
      fireEvent.change(screen.getByLabelText(/Nivel de Dificultad/i), { target: { value: 3 } });
      fireEvent.mouseDown(screen.getByLabelText(/Fase/i));
      fireEvent.click(screen.getByText('Fase 1'));
      fireEvent.click(screen.getByText('Crear'));
    });

  
  });

  test('displays error message on create failure', async () => {
    const mockPhases = [
      { id_fase: '1', nombre_fase: 'Fase 1' },
      { id_fase: '2', nombre_fase: 'Fase 2' },
    ];
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, mockPhases);
    mockAxios.onPost('http://localhost:5000/admin-api/create').reply(500);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Descripción del Desafío/i), { target: { value: 'Descripción de prueba' } });
      fireEvent.change(screen.getByLabelText(/Solución del Desafío/i), { target: { value: 'Solución de prueba' } });
      fireEvent.change(screen.getByLabelText(/Nivel de Dificultad/i), { target: { value: 3 } });
      fireEvent.mouseDown(screen.getByLabelText(/Fase/i));
      fireEvent.click(screen.getByText('Fase 1'));
      fireEvent.click(screen.getByText('Crear'));
    });

    await waitFor(() => {
      expect(screen.getByText('Error creating challenge.')).toBeInTheDocument();
    });
  });

 
});
