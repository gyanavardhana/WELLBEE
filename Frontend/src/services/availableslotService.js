import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to access cookies

// Define the base URL for the API
const API_URL = import.meta.env.VITE_APP_URL;

// Helper function to get the token from cookies
export const getAuthToken = () => Cookies.get("authToken");

// Create an Available Slot for a therapist
export const createAvailableSlot = async (slotData) => {
  const token = getAuthToken();
  const response = await axios.post(
    `${API_URL}slot/createslot`, // Change the URL according to your API
    slotData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get all available slots for a specific therapist
export const getAvailableSlots = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}slot/getslots`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update an Available Slot for a therapist
export const updateAvailableSlot = async (slotId, slotData) => {
  const token = getAuthToken();
  const response = await axios.put(
    `${API_URL}slot/updateslot/${slotId}`, // Change the URL according to your API
    slotData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Delete an Available Slot for a therapist
export const deleteAvailableSlot = async (slotId) => {
  const token = getAuthToken();
  const response = await axios.delete(
    `${API_URL}slot/deleteslot/${slotId}`, // Change the URL according to your API
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export const getAllSlots = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}slot/getallslots`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  