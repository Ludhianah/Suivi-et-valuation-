import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// 🔹 Login utilisateur
export const loginUser = async (username, password) => {
  // On crée l'objet attendu par Django
  const credentials = { username, password };

  // On envoie la requête POST
  const response = await axios.post(`${API_BASE_URL}/auth/login/`, credentials);

  // On retourne la réponse complète (status + data)
  return response;
};

// 🔹 Register utilisateur
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/users/`, userData);
  return response;
};
