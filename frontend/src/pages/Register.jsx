import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { registerUser } from "../services/authService";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Tous les champs sont obligatoires.");
      return;
    }

    try {
      await registerUser({ username, email, password });
      toast.success("Inscription réussie ! Redirection en cours...");
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'inscription. Vérifie les informations.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Toaster */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-[1.01] hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-7 text-center tracking-tight">
          Crée ton compte <span className="text-blue-600">✨</span>
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          <TextInput
            label="Nom d'utilisateur"
            placeholder="ex: dan_nah"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            classNames={{
              root: "flex flex-col gap-2",
              label: "text-gray-700 font-medium text-sm",
              input:
                "rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors",
            }}
            size="md"
          />

          <TextInput
            label="Email"
            placeholder="exemple@mail.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            classNames={{
              root: "flex flex-col gap-2",
              label: "text-gray-700 font-medium text-sm",
              input:
                "rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors",
            }}
            size="md"
          />

          <PasswordInput
            label="Mot de passe"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            classNames={{
              root: "flex flex-col gap-2",
              label: "text-gray-700 font-medium text-sm",
              input:
                "rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors",
            }}
            size="md"
          />

          <Button
            type="submit"
            fullWidth
            size="md"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all transform hover:scale-[1.01]"
          >
            S'inscrire
          </Button>
        </form>

        <div className="mt-5 text-center">
          <span
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
          >
            Déjà un compte ? Se connecter
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
