import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ChallengeList from '../../pages/desafioList';
import AuthContext from '../../context/authContext';

const mockAxios = new MockAdapter(axios);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ChallengeList Page', () => {
  const mockNavigate = jest.fn();
  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user, logout: jest.fn() }}>
        <Router>
          <ChallengeList />
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
    renderWithContext({ name: 'test', token: 'fake-token', id_rol: 1 });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  


  



  test('deletes challenge and updates list', async () => {
    const mockChallenges = [
      {
        id_desafio: '1',
        descripcion_desafio: 'Descripción de prueba',
        solucion_desafio: 'Solución de prueba',
        nivel_dificultad: 3,
        id_fase: '2',
        Pista: [{ id_pista: '1', informacion_pista: 'Pista 1' }],
        DocumentoAyudas: [{ id_documento: '1', informacion_vulnerabilidad: 'Documento de Ayuda 1' }],
        DocumentoPrevencions: [{ id_prevencion: '1', informacion_prevencion: 'Documento de Prevención 1' }],
      },
    ];
    mockAxios.onGet('http://localhost:5000/admin-api/challenges').reply(200, mockChallenges);
    mockAxios.onDelete('http://localhost:5000/admin-api/delete-challenge/1').reply(200);

    renderWithContext({ name: 'test', token: 'fake-token', id_rol: 1 });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('DeleteIcon').closest('button'));
    });

    await waitFor(() => {
      expect(screen.queryByText('Descripción de prueba')).not.toBeInTheDocument();
    });
  });

});
