import axios from "axios";

// Base URL de l'API pour Savoir-Faire
const API_URL = "http://127.0.0.1:8000/api/evaluation/savoir-faire/";

// Config par défaut avec token (si nécessaire)
const getConfig = () => {
  const token = localStorage.getItem("token"); // récupère le token si connecté
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

// 🔹 Récupérer tous les Savoir-Faire
export const getSavoirFaires = async () => {
  try {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  } catch (error) {
    console.error("Erreur getSavoirFaires :", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Créer un Savoir-Faire
export const createSavoirFaire = async (data) => {
  try {
    const response = await axios.post(API_URL, data, getConfig());
    return response.data;
  } catch (error) {
    console.error("Erreur createSavoirFaire :", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Modifier un Savoir-Faire
export const updateSavoirFaire = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data, getConfig());
    return response.data;
  } catch (error) {
    console.error("Erreur updateSavoirFaire :", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Supprimer un Savoir-Faire
export const deleteSavoirFaire = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`, getConfig());
    return response.data;
  } catch (error) {
    console.error("Erreur deleteSavoirFaire :", error.response?.data || error.message);
    throw error;
  }
};
