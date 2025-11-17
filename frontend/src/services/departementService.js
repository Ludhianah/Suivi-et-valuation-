import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/departements/";

// Récupérer tous les départements
export const getDepartements = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Créer un département
export const createDepartement = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// Modifier un département
export const updateDepartement = async (id, data) => {
  const response = await axios.put(`${API_URL}${id}/`, data);
  return response.data;
};

// Supprimer un département
export const deleteDepartement = async (id) => {
  await axios.delete(`${API_URL}${id}/`);
};
