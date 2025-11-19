import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/employees/";

export const getEmployes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // retourne une liste d’employés
  } catch (error) {
    console.error("Erreur lors de la récupération des employés :", error);
    throw error;
  }
};
