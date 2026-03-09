import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const dashboardApi = {
  getSummary: () => api.get('/dashboard'),
  getShipments: () => api.get('/shipments'),
  getLanes: () => api.get('/lanes'),
  getAnomalies: () => api.get('/anomalies'),
  getESG: () => api.get('/esg'),
  optimizeRoute: (data) => api.post('/optimize-route', data),
  calculateEmission: (data) => api.post('/calculate-emission', data),
  getAIInsight: (context) => api.post('/ai-insight', { context })
};

export default api;
