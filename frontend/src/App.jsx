import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Register from "./pages/Register";
import Departement from "./pages/Departement";
import SavoirFaire from "./pages/SavoirFaire";
import SavoirEtre from "./pages/SavoirEtre";
import Evaluation from "./pages/Evaluation";
import ProtectedRoute from "./security/ProtectedRoute";
import PublicRoute from "./security/PublicRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Layout commun pour les routes protégées */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 overflow-auto p-4">
                  <Home />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/departement"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 overflow-auto p-4">
                  <Departement />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/savoir-faire"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 overflow-auto p-4">
                  <SavoirFaire />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/savoir-etre"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 overflow-auto p-4">
                  <SavoirEtre />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/evaluation"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 overflow-auto p-4">
                  <Evaluation />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
