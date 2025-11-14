// src/security/PublicRoute.jsx
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("access");

  // si déjà connecté → redirige vers /home
  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
