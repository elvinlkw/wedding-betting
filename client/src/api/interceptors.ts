import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance
const apiClient = axios.create();

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Prepend the base URL to the request URL
    config.url = `${apiBaseUrl}${config.url}`;
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default apiClient;
