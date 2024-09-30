import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create context
const AuthContext = createContext();

// Create provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // State to store user email
  const [userRole, setUserRole] = useState(null); // State to store user role
  const [userName, setUserName] = useState(null);
  const [userImg, setUserImg] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token"); // or however you store your token

    if (token) {
      try {
        // Decode the token to get the payload
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true); // Set authentication state to true
        setUserEmail(decodedToken.email); // Extract and set the user email
        setUserRole(decodedToken.role); // Extract and set the user role
        setUserName(decodedToken.name);
        setUserImg(decodedToken.photoURL);
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthenticated(false); // Set authentication state to false if token is invalid
        setUserEmail(null); // Clear the email if the token is invalid
        setUserRole(null); // Clear the role if the token is invalid
      }
    } else {
      setIsAuthenticated(false); // No token found, user is not authenticated
      setUserEmail(null); // Clear the email if no token
      setUserRole(null); // Clear the role if no token
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        userRole,
        userName,
        userImg,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any,
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
