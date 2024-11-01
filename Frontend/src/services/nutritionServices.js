// src/services/healthService.js
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_APP_URL; // Backend URL

// Set up the axios instance with token interceptor
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch health information combining food and exercise data
export const getHealthInfo = async (foodItem, exerciseQuery) => {
  try {
    const response = await apiClient.post(`/healthinfo/health-info`, {
      foodItem,
      exerciseQuery,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching health information:", error);
    throw error;
  }
};
