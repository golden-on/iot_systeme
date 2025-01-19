import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // URL de ton backend
});

export async function fetchHealthData() {
    const response = await api.get('/data/');
    return response.data;
  }
export default api;
