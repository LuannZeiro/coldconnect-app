import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // ou IP da API em execução
});

export default api;
