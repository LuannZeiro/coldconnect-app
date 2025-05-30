import axios from 'axios';

const API_URL = 'http://10.0.2.2:8080/abrigos';

export const getAbrigos = async (token) => {
    return axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const createAbrigo = async (abrigo, token) => {
    return axios.post(API_URL, abrigo, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const deleteAbrigo = async (id, token) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
