import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setUser({ token, ...parsedUserInfo });
      } catch (error) {
        console.error("Error parsing userInfo from localStorage:", error);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', userData);
      const { auth, token, user } = response.data;

      if (auth) {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(user));
        setUser({ token, ...user });
      }
    } catch (error) {
      console.error("Registration failed:", error.response.data.message);
      throw new Error(error.response.data.message);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', credentials);
      const { auth, token, user } = response.data;

      if (auth) {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(user));
        setUser({ token, ...user });
      }
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
      throw new Error(error.response.data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await axios.put('http://localhost:5000/api/users/update', updatedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const { token, user: updatedUser } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser({ token, ...updatedUser });
    } catch (error) {
      console.error("Update failed:", error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
