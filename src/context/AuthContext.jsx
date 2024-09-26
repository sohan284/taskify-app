import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Create provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for token and set authentication state
  useEffect(() => {
    const token = localStorage.getItem('token'); // or however you store your token
    setIsAuthenticated(!!token); // true if token exists, false otherwise
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any,
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
