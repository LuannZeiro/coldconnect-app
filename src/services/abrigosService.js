import axios from 'axios';

const API_URL = 'http://localhost:8080/abrigos';

// Função auxiliar para pegar token do localStorage ou outro local
const getAuthHeader = () => {
    const token = localStorage.getItem('token');  // ou AsyncStorage, depende se é Web ou React Native
    return { Authorization: `Bearer ${token}` };
};

export const getAbrigos = () => axios.get(API_URL, { headers: getAuthHeader() });

export const createAbrigo = (abrigo) => axios.post(API_URL, abrigo, { headers: getAuthHeader() });

export const deleteAbrigo = (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
