import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/evaluation/indicateurs-se/";

export const getIndicateursSE = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // liste des indicateurs SE
  } catch (error) {
    console.error("Erreur lors de la récupération des indicateurs SE :", error);
    throw error;
  }
};
