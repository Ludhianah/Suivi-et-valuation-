import axios from "axios";

// Base URL de l'API Evaluation
const API_URL = "http://127.0.0.1:8000/api/evaluation/evaluations/";

// 🔹 Récupérer toutes les évaluations
export const getEvaluations = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getEvaluations :", error);
    throw error;
  }
};

// 🔹 Créer une évaluation
export const createEvaluation = async (data) => {
  try {
    const response = await axios.post(`${API_URL}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur createEvaluation :", error);
    throw error;
  }
};

// 🔹 Modifier une évaluation
export const updateEvaluation = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur updateEvaluation :", error);
    throw error;
  }
};

// 🔹 Supprimer une évaluation
export const deleteEvaluation = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur deleteEvaluation :", error);
    throw error;
  }
};
