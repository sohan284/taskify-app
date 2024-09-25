import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  // If loading, you can show a loading spinner or some placeholder
  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};
ProtectedRoute.propTypes = {
  element: PropTypes.any,
};
export default ProtectedRoute;
