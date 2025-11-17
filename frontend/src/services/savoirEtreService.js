import axios from "axios";

// Base URL de l'API Savoir-Être
const API_URL = "http://127.0.0.1:8000/api/evaluation/savoir-etre/";

// 🔹 Récupérer tous les Savoir-Être
export const getSavoirEtres = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erreur getSavoirEtres :", error);
    throw error;
  }
};

// 🔹 Créer un Savoir-Être
export const createSavoirEtre = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("Erreur createSavoirEtre :", error);
    throw error;
  }
};

// 🔹 Modifier un Savoir-Être
export const updateSavoirEtre = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur updateSavoirEtre :", error);
    throw error;
  }
};

// 🔹 Supprimer un Savoir-Être
export const deleteSavoirEtre = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur deleteSavoirEtre :", error);
    throw error;
  }
};
