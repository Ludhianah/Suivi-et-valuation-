import { useState } from 'react';
import axios from 'axios';
import { TextInput, PasswordInput, Button } from '@mantine/core';
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ ajout de useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username: username,
        password: password,
      });

      // ✅ Stocker les tokens JWT
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      alert('Connexion réussie 🎉');
      console.log('✅ Token reçu :', response.data);

      // 👉 Ici, tu peux rediriger selon le rôle :
      navigate('/home'); // ici "/" correspond à Home.jsx
      // window.location.href = '/dashboard';

    } catch (err) {
      console.error('Erreur de connexion :', err);
      setError("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-[1.01] hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-7 text-center tracking-tight">
          Bienvenue <span className="text-blue-600">👋</span>
        </h2>

        {/* ✅ Formulaire fonctionnel */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Nom d'utilisateur"
            placeholder="ex: dan_nah"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            classNames={{
              root: 'flex flex-col gap-2',
              label: 'text-gray-700 font-medium text-sm',
              input:
                'rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors',
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
              root: 'flex flex-col gap-2',
              label: 'text-gray-700 font-medium text-sm',
              input:
                'rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors',
            }}
            size="md"
          />

          <Button
            type="submit"
            fullWidth
            size="md"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all transform hover:scale-[1.01]"
          >
            Se connecter
          </Button>
        </form>

        {error && (
          <p className="text-red-600 text-center mt-3 font-medium">{error}</p>
        )}

        <div className="mt-5 text-center">
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
