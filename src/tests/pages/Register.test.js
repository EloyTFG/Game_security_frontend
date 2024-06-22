// src/tests/pages/SignUp.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthContext from '../../context/authContext';
import SignUp from '../../pages/Register';

// Mock para la importación problemática de vanta.net
jest.mock('vanta/src/vanta.net', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock para window.alert
global.alert = jest.fn();

// Mock de `useNavigate` de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SignUp Page', () => {
  const mockRegister = jest.fn().mockRejectedValue(new Error('Invalid data'));

  const renderWithContext = () => {
    return render(
      <AuthContext.Provider value={{ register: mockRegister }}>
        <Router>
          <SignUp />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sign up page without crashing', () => {
    renderWithContext();

    const signUpHeadings = screen.getAllByText(/sign up/i);
    expect(signUpHeadings.length).toBeGreaterThan(0);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('calls register function with correct data on form submit', async () => {
    renderWithContext();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        nombre_completo: 'Test User',
        nombre_usuario: 'testuser',
        correo_electronico: 'test@example.com',
        fecha_nacimiento: '1990-01-01',
        contraseña: 'password123',
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('displays error message on registration failure', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Invalid data'));

    renderWithContext();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Error al registrar: Invalid data');
    });
  });

 
});
