import { useState } from 'react';
import { TextInput, PasswordInput, Button } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast"; // ✅ Import toast

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }

    try {
      const response = await loginUser(username, password);

      // Stockage des tokens
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Notification de succès
      toast.success("Connexion réussie !");

      // Redirection vers /home
      navigate("/home");

    } catch (err) {
      console.error("Erreur de connexion :", err);
      toast.error("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl">

        <h2 className="text-2xl font-bold text-gray-800 mb-7 text-center">
          Connexion <span className="text-blue-600">👋</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Nom d'utilisateur"
            placeholder="ex: dan_nah"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="md"
          />

          <PasswordInput
            label="Mot de passe"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="md"
          />

          <Button
            type="submit"
            fullWidth
            size="md"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            Se connecter
          </Button>
        </form>

        <div className="mt-5 text-center">
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Mot de passe oublié ?
          </a>
          <span className="mx-1"></span>
          <span
            onClick={() => navigate("/register")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors underline"
          >
            S'inscrire
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
