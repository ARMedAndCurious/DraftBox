import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role); // e.g. "ROLE_ADMIN" or "ROLE_USER"
        localStorage.setItem('token', token);
      } catch (error) {
        console.error("Invalid token", error);
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
      }
    } else {
      setRole(null);
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ token, role, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
