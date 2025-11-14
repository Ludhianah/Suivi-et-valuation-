import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login"; // ton LoginForm
import Home from "./pages/Home";       // Home simple
import Sidebar from "./components/Sidebar"; // ✅ Import de la Sidebar
import Register from "./pages/Register"; // chemin relatif vers ton fichier Register.jsx
import Departement from "./pages/Departement";//importation de la page Departement
import SavoirFaire from "./pages/SavoirFaire";//importation de la page SavoirFaire
import SavoirEtre from "./pages/SavoirEtre";//importation de la page SavoirEtre
import Evaluation from "./pages/Evaluation";//importation de la page Evaluation

import ProtectedRoute from "./security/ProtectedRoute";
import PublicRoute from "./security/PublicRoute";


function App() {
  return (
    <Router>
      <Routes>
        {/* Page par défaut → redirige vers /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Route publique */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/* ✅ Route publique : inscription */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Route protégée */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              {/* ✅ Ici, on affiche la Sidebar et la page Home côte à côte */}
              <div className="flex">
                {/* Sidebar à gauche */}
                <Sidebar />
                <Home />
              </div>
            </ProtectedRoute>
          }
        />


        <Route
          path="/departement"
          element={
            <ProtectedRoute>
              {/* ✅ Ici, on affiche la Sidebar et la page Home côte à côte */}
              <div className="flex">
                {/* Sidebar à gauche */}
                <Sidebar />
                <Departement />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/savoir-faire"
          element={
            <ProtectedRoute>
              {/* ✅ Ici, on affiche la Sidebar et la page Home côte à côte */}
              <div className="flex">
                {/* Sidebar à gauche */}
                <Sidebar />
                <SavoirFaire />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/savoir-etre"
          element={
            <ProtectedRoute>
              {/* ✅ Ici, on affiche la Sidebar et la page Home côte à côte */}
              <div className="flex">
                {/* Sidebar à gauche */}
                <Sidebar />
                <SavoirEtre />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluation"
          element={
            <ProtectedRoute>
              {/* ✅ Ici, on affiche la Sidebar et la page Home côte à côte */}
              <div className="flex">
                {/* Sidebar à gauche */}
                <Sidebar />
                <Evaluation />
              </div>
            </ProtectedRoute>
          }
        />
        {/* Page 404 → redirige vers /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

    </Router>
  );
}

export default App;
