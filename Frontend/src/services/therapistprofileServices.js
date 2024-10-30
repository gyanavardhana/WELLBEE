import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

// Define the base URL for the API
const API_URL = import.meta.env.VITE_APP_URL;

// Helper function to get the token from cookies
const getAuthToken = () => Cookies.get("authToken");

// Create a TherapistProfile for a user (therapist)
export const createTherapistProfile = async (specialization) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(
      `${API_URL}therapy/therapistprofile`,
      { specialization },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Error creating therapist profile" }
    );
  }
};

// Get all therapist profiles
export const getAllTherapistProfiles = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_URL}therapy/therapistprofiles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Error fetching therapist profiles" }
    );
  }
};

// Get therapist profile for the current user
export const getTherapistProfile = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${API_URL}therapy/therapistprofile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Error fetching therapist profile" }
    );
  }
};

// Update a therapist's profile (specialization or ratings)
export const updateTherapistProfile = async (specialization, ratings) => {
  const token = getAuthToken();
  try {
    const response = await axios.put(
      `${API_URL}therapy/therapistprofile`,
      { specialization, ratings },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Error updating therapist profile" }
    );
  }
};

export const updateTherapistProfilebyUser = async (id, specialization, ratings) => {
  const token = getAuthToken();
  try {
    const response = await axios.put(
      `${API_URL}therapy/therapistprofile/rating`,
      { id, specialization, ratings },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Error updating therapist profile" }
    );
  }
};

// Delete therapist profile for a user
export const deleteTherapistProfile = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.delete(`${API_URL}therapy/therapistprofile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Error deleting therapist profile" }
    );
  }
};

// Chat handler function for AI interactions
export const chatWithTherapistAI = async (userInput) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(
      `${API_URL}therapy/chat`,
      { userInput },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Error processing chat interaction" }
    );
  }
};
