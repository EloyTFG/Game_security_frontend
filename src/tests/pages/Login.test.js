// src/tests/pages/Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthContext from '../../context/authContext';
import SignInSide from '../../pages/Login';

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

describe('Login Page', () => {
  const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));

  const renderWithContext = () => {
    return render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Router>
          <SignInSide />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login page without crashing', () => {
    renderWithContext();

    const signInHeadings = screen.getAllByText(/sign in/i);
    expect(signInHeadings.length).toBeGreaterThan(0);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('calls login function with correct data on form submit', async () => {
    renderWithContext();

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    await waitFor(() => {
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    });

    expect(mockLogin).toHaveBeenCalledWith({
      correo_electronico: 'test@example.com',
      contraseña: 'password123',
    });
  });

});
