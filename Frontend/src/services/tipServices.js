// src/services/tipService.js
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_APP_URL; // Update with your backend URL

// Set up the axios instance with an interceptor for adding the token
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add an interceptor to include the token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken"); // Or retrieve it from context if using a provider
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export API methods that use the configured axios instance
export const createExerciseTip = async (tip) => {
  const response = await apiClient.post(`/excersice/createexcersicetip`, { tip });
  return response.data;
};

export const getExerciseTips = async () => {
  const response = await apiClient.get(`/excersice/getexcersicetips`);
  return response.data.exerciseTips;
};

export const updateExerciseTip = async (tipId, updatedTip) => {
  const response = await apiClient.put(`/excersice/updateexcersicetip/${tipId}`, { tip: updatedTip });
  return response.data;
};

export const deleteExerciseTip = async (tipId) => {
  const response = await apiClient.delete(`/excersice/deleteexcersicetip/${tipId}`);
  return response.data;
};

export const getExerciseRecommendations = async (height, weight) => {
    try {
      const response = await apiClient.post(`/excersice/getexcersices`, {
        height,
        weight,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching exercise recommendations:", error);
      throw error;
    }
  };
  
  