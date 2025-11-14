// src/security/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

function ProtectedRoute({ children }) {
  // Plus de requête HTTP → plus de 404
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;