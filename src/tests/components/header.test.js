
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ButtonAppBar from '../../components/header';
import AuthContext from '../../context/authContext';

describe('ButtonAppBar Component', () => {
  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user, logout: jest.fn() }}>
        <Router>
          <ButtonAppBar />
        </Router>
      </AuthContext.Provider>
    );
  };

  test('displays Game Security title', () => {
    renderWithContext(null);

    expect(screen.getByText(/game security/i)).toBeInTheDocument();
  });

  test('shows login button when user is not logged in', () => {
    renderWithContext(null);


    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  test('displays user initials when user is logged in', () => {
    const mockUser = { nombre_usuario: 'John Doe' };
    renderWithContext(mockUser);

    expect(screen.getByText(/JD/i)).toBeInTheDocument();
  });

  test('opens and closes drawer', () => {
    const mockUser = { nombre_usuario: 'John Doe' };
    renderWithContext(mockUser);

    const menuButton = screen.getByLabelText(/menu/i);
    fireEvent.click(menuButton);

 
    const presentations = screen.getAllByRole('presentation');
    expect(presentations[0]).toBeInTheDocument();


    fireEvent.keyDown(presentations[0], { key: 'Escape' });
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  test('navigates to profile page when My Profile is clicked', () => {
    const mockUser = { nombre_usuario: 'John Doe' };
    renderWithContext(mockUser);

    fireEvent.click(screen.getByLabelText(/menu/i));
    fireEvent.click(screen.getByText(/my profile/i));
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  test('logout button calls logout function', () => {
    const mockLogout = jest.fn();
    const mockUser = { nombre_usuario: 'John Doe' };
    render(
      <AuthContext.Provider value={{ user: mockUser, logout: mockLogout }}>
        <Router>
          <ButtonAppBar />
        </Router>
      </AuthContext.Provider>
    );

    
    fireEvent.click(screen.getByLabelText(/menu/i));
    fireEvent.click(screen.getByText(/logout/i));

    expect(mockLogout).toHaveBeenCalled();
  });
});
