// src/tests/context/authContext.test.js
import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AuthContext, { AuthProvider } from '../../context/authContext';

const mockAxios = new MockAdapter(axios);

const mockUser = {
  id: '1',
  nombre_completo: 'Test User',
  nombre_usuario: 'testuser',
  correo_electronico: 'test@example.com',
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('initializes with user from localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userInfo', JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <div>
              {value.user && (
                <span data-testid="user">{value.user.nombre_completo}</span>
              )}
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('Test User');
  });

  test('registers a new user', async () => {
    mockAxios.onPost('http://localhost:5000/api/users/register').reply(200, {
      auth: true,
      token: 'new-fake-token',
      user: mockUser,
    });

    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div />;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await act(async () => {
      await contextValue.register({
        nombre_completo: 'Test User',
        nombre_usuario: 'testuser',
        correo_electronico: 'test@example.com',
        contraseña: 'password',
      });
    });

    expect(localStorage.getItem('token')).toBe('new-fake-token');
    expect(JSON.parse(localStorage.getItem('userInfo'))).toEqual(mockUser);
    expect(contextValue.user.nombre_completo).toBe('Test User');
  });

  test('logs in a user', async () => {
    mockAxios.onPost('http://localhost:5000/api/users/login').reply(200, {
      auth: true,
      token: 'fake-token',
      user: mockUser,
    });

    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div />;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await act(async () => {
      await contextValue.login({
        correo_electronico: 'test@example.com',
        contraseña: 'password',
      });
    });

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(JSON.parse(localStorage.getItem('userInfo'))).toEqual(mockUser);
    expect(contextValue.user.nombre_completo).toBe('Test User');
  });

  test('logs out a user', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userInfo', JSON.stringify(mockUser));

    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div />;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    act(() => {
      contextValue.logout();
    });

    expect(localStorage.getItem('token')).toBe(null);
    expect(localStorage.getItem('userInfo')).toBe(null);
    expect(contextValue.user).toBe(null);
  });

  test('updates a user', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userInfo', JSON.stringify(mockUser));

    mockAxios.onPut('http://localhost:5000/api/users/update').reply(200, {
      token: 'updated-token',
      user: { ...mockUser, nombre_completo: 'Updated User' },
    });

    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div />;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    await act(async () => {
      await contextValue.updateUser({ nombre_completo: 'Updated User' });
    });

    expect(localStorage.getItem('token')).toBe('updated-token');
    expect(JSON.parse(localStorage.getItem('userInfo'))).toEqual({
      ...mockUser,
      nombre_completo: 'Updated User',
    });
    expect(contextValue.user.nombre_completo).toBe('Updated User');
  });
});
