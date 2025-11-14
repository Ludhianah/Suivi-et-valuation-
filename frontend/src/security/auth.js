// src/security/auth.js

// Fonction pour décoder le token JWT (sans bibliothèque)
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// Vérifie si l'utilisateur est authentifié
export const isAuthenticated = () => {
  const token = localStorage.getItem('access');
  if (!token) return false;

  const payload = decodeToken(token);
  if (!payload) return false;

  // Vérifie l'expiration (exp = timestamp en secondes)
  const isExpired = payload.exp * 1000 < Date.now();
  if (isExpired) {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return false;
  }

  return true;
};

// Optionnel : rafraîchir le token avec refresh
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return false;

  try {
    const res = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
      refresh,
    });

    localStorage.setItem('access', res.data.access);
    return true;
  } catch (error) {
    console.warn('Refresh token échoué', error);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return false;
  }
};