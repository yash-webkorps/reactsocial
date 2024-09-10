import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: '/user',
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');

    if (token && !config.url?.includes('/signup') && !config.url?.includes('/login')) {
      config.headers.auth = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
