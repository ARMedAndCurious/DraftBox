import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    if (token) {
      token = token.replace(/^"|"$/g, ''); // Strip quotes if they exist
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401/403 responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token and redirect to login on unauthorized/forbidden
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
