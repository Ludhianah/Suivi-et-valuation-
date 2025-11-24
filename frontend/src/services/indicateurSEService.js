// src/services/indicateurSEService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/evaluation/indicateurs-se/";

// Récupérer tous les indicateurs SE
export const getIndicateursSE = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des indicateurs SE :", error);
    throw error;
  }
};

// Ajouter un nouvel indicateur SE
export const addIndicateurSE = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'indicateur SE :", error);
    throw error;
  }
};

// Modifier un indicateur SE
export const updateIndicateurSE = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'indicateur SE :", error);
    throw error;
  }
};

// Supprimer un indicateur SE
export const deleteIndicateurSE = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'indicateur SE :", error);
    throw error;
  }
};
