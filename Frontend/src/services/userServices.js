import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_APP_URL; // Replace with your actual backend URL

// Register a new user
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}users/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error.response?.data || error.message;
  }
};

// Login the user and store JWT token in cookies
export const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}users/login`, loginData);
    const token = response.data.token;
    let role = response.data.role;
    if (!role){
      role = "USER"
    }
    if (token) {
      Cookies.set("authToken", token, { expires: 1 }); 
      Cookies.set("role", role, { expires: 1 }); 
    }
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error.response?.data || error.message;
  }
};

// Retrieve user profile information
export const getUserProfile = async () => {
  try {
    const token = Cookies.get("authToken");
    const response = await axios.get(`${API_BASE_URL}users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user;
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    throw error.response?.data || error.message;
  }
};

// Update user profile details (name, profilePic, height, weight)
export const updateUserProfile = async (updatedData) => {
  try {
    const token = Cookies.get("authToken");
    const response = await axios.put(
      `${API_BASE_URL}users/profile`,
      updatedData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.message;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error.response?.data || error.message;
  }
};
