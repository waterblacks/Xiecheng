import axios from 'axios';
import mockData from '../mocks';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

if (USE_MOCK) {
  instance.interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.config && error.config.url) {
        const mockResponse = mockData.matchRequest(
          error.config.method?.toUpperCase() || 'GET',
          error.config.url,
          error.config.params,
          error.config.data
        );
        if (mockResponse) {
          return Promise.resolve({ data: mockResponse, status: 200 });
        }
      }
      return Promise.reject(error);
    }
  );

  instance.interceptors.request.use((config) => {
    const mockResponse = mockData.matchRequest(
      config.method?.toUpperCase() || 'GET',
      config.url,
      config.params,
      config.data
    );
    if (mockResponse) {
      return Promise.reject({ __mock__: true, response: mockResponse, config });
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.__mock__) {
        return Promise.resolve({ data: error.response, status: 200 });
      }
      return Promise.reject(error);
    }
  );
}

export default instance;
