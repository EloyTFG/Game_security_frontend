// src/tests/components/ProductHero.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';  // Para aserciones como toBeInTheDocument
import { BrowserRouter as Router } from 'react-router-dom';
import ProductHero from '../../components/ProductHero'; // Ajusta la ruta si es necesario
import AuthContext from '../../context/authContext';

describe('ProductHero Component', () => {
  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user }}>
        <Router>
          <ProductHero />
        </Router>
      </AuthContext.Provider>
    );
  };

  test('renders welcome message for logged-in user', () => {
    const mockUser = { nombre_usuario: 'testuser' };
    renderWithContext(mockUser);

    expect(screen.getByText(/welcome, testuser/i)).toBeInTheDocument();
    // Cambia de 'button' a 'link'
    expect(screen.getByRole('link', { name: /start playing/i })).toBeInTheDocument();
  });

  test('renders register and login buttons for anonymous user', () => {
    renderWithContext(null);

    // Cambia de 'button' a 'link'
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/discover the experience/i)).toBeInTheDocument();
  });

  test('renders correct background and heading', () => {
    renderWithContext(null);

    const heading = screen.getByText(/game security/i);
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });
});
