import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to access cookies

// Define the base URL for the API
const API_URL = import.meta.env.VITE_APP_URL;

// Helper function to get the token from cookies
const getAuthToken = () => Cookies.get("authToken");

// Create a health metric for a user
export const createHealthMetric = async (healthMetricData) => {
  const token = getAuthToken();
  const response = await axios.post(
    `${API_URL}health/createmetric`,
    healthMetricData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get all health metrics for a user
export const getHealthMetrics = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}health/getmetrics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update a specific health metric for a user
export const updateHealthMetric = async (metricId, healthMetricData) => {
  const token = getAuthToken();
  const response = await axios.put(
    `${API_URL}health/updatemetric/${metricId}`,
    healthMetricData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Delete a specific health metric for a user
export const deleteHealthMetric = async (metricId) => {
  const token = getAuthToken();
  const response = await axios.delete(
    `${API_URL}health/deleltemetric/${metricId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
