import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import EditChallenge from '../../pages/editDesafio';
import AuthContext from '../../context/authContext';

const mockAxios = new MockAdapter(axios);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: jest.fn(),
}));

describe('EditChallenge Page', () => {
  const mockNavigate = jest.fn();
  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user, logout: jest.fn() }}>
        <Router>
          <EditChallenge />
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

  test('displays error message when challenge data fails to load', async () => {
    mockAxios.onGet('http://localhost:5000/admin-api/challenges/1').reply(500);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByText('Error fetching challenge.')).toBeInTheDocument();
    });
  });

  test('fetches and displays challenge data', async () => {
    const mockChallengeData = {
      id_desafio: '1',
      descripcion_desafio: 'Descripción de prueba',
      solucion_desafio: 'Solución de prueba',
      nivel_dificultad: 3,
      id_fase: '2',
      Pista: [{ informacion_pista: 'Pista 1' }],
      DocumentoAyudas: [{ informacion_vulnerabilidad: 'Documento de Ayuda 1' }],
      DocumentoPrevencions: [{ informacion_prevencion: 'Documento de Prevención 1' }],
    };
    const mockPhases = [
      { id_fase: '1', nombre_fase: 'Fase 1' },
      { id_fase: '2', nombre_fase: 'Fase 2' },
    ];
    mockAxios.onGet('http://localhost:5000/admin-api/challenges/1').reply(200, mockChallengeData);
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, mockPhases);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Descripción de prueba')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Solución de prueba')).toBeInTheDocument();
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Pista 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Documento de Ayuda 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Documento de Prevención 1')).toBeInTheDocument();
    });
  });

 

  test('updates challenge and navigates to challenge list on successful submit', async () => {
    const mockChallengeData = {
      id_desafio: '1',
      descripcion_desafio: 'Descripción de prueba',
      solucion_desafio: 'Solución de prueba',
      nivel_dificultad: 3,
      id_fase: '2',
      Pista: [{ informacion_pista: 'Pista 1' }],
      DocumentoAyudas: [{ informacion_vulnerabilidad: 'Documento de Ayuda 1' }],
      DocumentoPrevencions: [{ informacion_prevencion: 'Documento de Prevención 1' }],
    };
    const mockPhases = [
      { id_fase: '1', nombre_fase: 'Fase 1' },
      { id_fase: '2', nombre_fase: 'Fase 2' },
    ];
    mockAxios.onGet('http://localhost:5000/admin-api/challenges/1').reply(200, mockChallengeData);
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, mockPhases);
    mockAxios.onPut('http://localhost:5000/admin-api/update-challenge/1').reply(200);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Descripción del Desafío/i), { target: { value: 'Descripción actualizada' } });
      fireEvent.change(screen.getByLabelText(/Solución del Desafío/i), { target: { value: 'Solución actualizada' } });
      fireEvent.change(screen.getByLabelText(/Nivel de Dificultad/i), { target: { value: 4 } });
      fireEvent.mouseDown(screen.getByRole('combobox'));
      fireEvent.click(screen.getByText('Fase 1'));
      fireEvent.click(screen.getByText('Actualizar'));
    });

   
  });

  test('displays error message on update failure', async () => {
    const mockChallengeData = {
      id_desafio: '1',
      descripcion_desafio: 'Descripción de prueba',
      solucion_desafio: 'Solución de prueba',
      nivel_dificultad: 3,
      id_fase: '2',
      Pista: [{ informacion_pista: 'Pista 1' }],
      DocumentoAyudas: [{ informacion_vulnerabilidad: 'Documento de Ayuda 1' }],
      DocumentoPrevencions: [{ informacion_prevencion: 'Documento de Prevención 1' }],
    };
    const mockPhases = [
      { id_fase: '1', nombre_fase: 'Fase 1' },
      { id_fase: '2', nombre_fase: 'Fase 2' },
    ];
    mockAxios.onGet('http://localhost:5000/admin-api/challenges/1').reply(200, mockChallengeData);
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, mockPhases);
    mockAxios.onPut('http://localhost:5000/admin-api/update-challenge/1').reply(500);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Descripción del Desafío/i), { target: { value: 'Descripción actualizada' } });
      fireEvent.change(screen.getByLabelText(/Solución del Desafío/i), { target: { value: 'Solución actualizada' } });
      fireEvent.change(screen.getByLabelText(/Nivel de Dificultad/i), { target: { value: 4 } });
      fireEvent.mouseDown(screen.getByRole('combobox'));
      fireEvent.click(screen.getByText('Fase 1'));
      fireEvent.click(screen.getByText('Actualizar'));
    });

    await waitFor(() => {
      expect(screen.getByText('Error updating challenge.')).toBeInTheDocument();
    });
  });

  test('adds and removes pistas', async () => {
    const mockChallengeData = {
      id_desafio: '1',
      descripcion_desafio: 'Descripción de prueba',
      solucion_desafio: 'Solución de prueba',
      nivel_dificultad: 3,
      id_fase: '2',
      Pista: [],
      DocumentoAyudas: [],
      DocumentoPrevencions: [],
    };
    const mockPhases = [
      { id_fase: '1', nombre_fase: 'Fase 1' },
      { id_fase: '2', nombre_fase: 'Fase 2' },
    ];
    mockAxios.onGet('http://localhost:5000/admin-api/challenges/1').reply(200, mockChallengeData);
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, mockPhases);

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
    const mockChallengeData = {
      id_desafio: '1',
      descripcion_desafio: 'Descripción de prueba',
      solucion_desafio: 'Solución de prueba',
      nivel_dificultad: 3,
      id_fase: '2',
      Pista: [],
      DocumentoAyudas: [],
      DocumentoPrevencions: [],
    };
    const mockPhases = [
      { id_fase: '1', nombre_fase: 'Fase 1' },
      { id_fase: '2', nombre_fase: 'Fase 2' },
    ];
    mockAxios.onGet('http://localhost:5000/admin-api/challenges/1').reply(200, mockChallengeData);
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, mockPhases);

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
    const mockChallengeData = {
      id_desafio: '1',
      descripcion_desafio: 'Descripción de prueba',
      solucion_desafio: 'Solución de prueba',
      nivel_dificultad: 3,
      id_fase: '2',
      Pista: [],
      DocumentoAyudas: [],
      DocumentoPrevencions: [],
    };
    const mockPhases = [
      { id_fase: '1', nombre_fase: 'Fase 1' },
      { id_fase: '2', nombre_fase: 'Fase 2' },
    ];
    mockAxios.onGet('http://localhost:5000/admin-api/challenges/1').reply(200, mockChallengeData);
    mockAxios.onGet('http://localhost:5000/admin-api/fases').reply(200, mockPhases);

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

 
});
