import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  // If loading, you can show a loading spinner or some placeholder
  if (loading) {
    return <div>Loading...</div>; // Or your custom loading component
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
