import axios from "axios";

// Base URL de l'API pour les Indicateurs de Savoir-Faire
const API_URL = "http://127.0.0.1:8000/api/evaluation/indicateurs-sf";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

// 🔹 Récupérer tous les Indicateurs SF
export const getIndicateurSF = async () => {
  try {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  } catch (error) {
    console.error("Erreur getIndicateurSF :", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Ajouter un Indicateur SF
export const addIndicateurSF = async (data) => {
  try {
    const response = await axios.post(API_URL, data, getConfig());
    return response.data;
  } catch (error) {
    console.error("Erreur addIndicateurSF :", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Modifier un Indicateur SF
export const updateIndicateurSF = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/`, data, getConfig());
    return response.data;
  } catch (error) {
    console.error("Erreur updateIndicateurSF :", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Supprimer un Indicateur SF
export const deleteIndicateurSF = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}/`, getConfig());
    return response.data;
  } catch (error) {
    console.error("Erreur deleteIndicateurSF :", error.response?.data || error.message);
    throw error;
  }
};
