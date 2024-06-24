import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router, useParams, useNavigate } from 'react-router-dom';
import Challenge from '../../pages/challengeDetail';
import AuthContext from '../../context/authContext';


const mockAxios = new MockAdapter(axios);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id_desafio: '1' }),
  useNavigate: jest.fn(),
}));

describe('Challenge Page', () => {
  const mockNavigate = jest.fn();
  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user }}>
        <Router>
          <Challenge />
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
    mockAxios.onGet('http://localhost:5000/api/challenge/1').reply(500);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
  
      expect(screen.queryByText((content, element) => {
        return content.startsWith('Challenge not found');
      })).toBeInTheDocument();
    });
  });

 


  test('displays multiple choice options and selects correct answer', async () => {
    const mockChallenge = {
      id_desafio: '1',
      descripcion_desafio: 'Descripción de prueba',
      solucion_desafio: 'solución1 & opción2 & opción3',
      Pista: [{ id_pista: '1', informacion_pista: 'Pista 1' }],
    };
    mockAxios.onGet('http://localhost:5000/api/challenge/1').reply(200, mockChallenge);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      const selectElement = screen.getByLabelText('Selecciona la respuesta correcta');
      fireEvent.mouseDown(selectElement);
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('solución1'));
    });

    fireEvent.click(screen.getByText('Enviar'));

    await waitFor(() => {
      expect(screen.getByText('¡Respuesta correcta!')).toBeInTheDocument();
    });
  });


});
