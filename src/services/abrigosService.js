import axios from 'axios';

const API_URL = 'http://localhost:8080/abrigos';

export const getAbrigos = () => axios.get(API_URL);

export const createAbrigo = (abrigo) => axios.post(API_URL, abrigo);

export const deleteAbrigo = (id) => axios.delete(`${API_URL}/${id}`);
