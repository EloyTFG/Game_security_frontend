// src/tests/pages/EditUser.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import EditUser from '../../pages/editUser';
import AuthContext from '../../context/authContext';

// Mock de axios
const mockAxios = new MockAdapter(axios);

// Mock de useParams para obtener el id del usuario
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '1',
  }),
  useNavigate: jest.fn(),
}));

describe('EditUser Page', () => {
  const mockNavigate = jest.fn();
  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user, logout: jest.fn() }}>
        <Router>
          <EditUser />
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

  test('displays error message when user data fails to load', async () => {
    mockAxios.onGet('http://localhost:5000/admin-api/users/1').reply(500);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByText('Error fetching user. Please try again.')).toBeInTheDocument();
    });
  });

  test('fetches and displays user data', async () => {
    const mockUserData = {
      id_usuario: '1',
      nombre_completo: 'Juan Pérez',
      nombre_usuario: 'jperez',
    };
    mockAxios.onGet('http://localhost:5000/admin-api/users/1').reply(200, mockUserData);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jperez')).toBeInTheDocument();
    });
  });

  test('shows error message if required fields are empty on submit', async () => {
    const mockUserData = {
      id_usuario: '1',
      nombre_completo: '',
      nombre_usuario: '',
    };
    mockAxios.onGet('http://localhost:5000/admin-api/users/1').reply(200, mockUserData);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Actualizar'));
    });

    expect(screen.getByText('All fields are required.')).toBeInTheDocument();
  });

  test('updates user and navigates to user list on successful submit', async () => {
    const mockUserData = {
      id_usuario: '1',
      nombre_completo: 'Juan Pérez',
      nombre_usuario: 'jperez',
    };
    mockAxios.onGet('http://localhost:5000/admin-api/users/1').reply(200, mockUserData);
    mockAxios.onPut('http://localhost:5000/admin-api/update/1').reply(200);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Juan Pérez' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'jperez' } });
      fireEvent.click(screen.getByText('Actualizar'));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/user-list');
    });
  });

  test('displays error message on update failure', async () => {
    const mockUserData = {
      id_usuario: '1',
      nombre_completo: 'Juan Pérez',
      nombre_usuario: 'jperez',
    };
    mockAxios.onGet('http://localhost:5000/admin-api/users/1').reply(200, mockUserData);
    mockAxios.onPut('http://localhost:5000/admin-api/update/1').reply(500);

    renderWithContext({ name: 'test', token: 'fake-token' });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Juan Pérez' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'jperez' } });
      fireEvent.click(screen.getByText('Actualizar'));
    });

    await waitFor(() => {
      expect(screen.getByText('Error updating user. Please try again.')).toBeInTheDocument();
    });
  });
});
