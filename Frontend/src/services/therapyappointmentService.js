import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to access cookies

// Define the base URL for the API
const API_URL = import.meta.env.VITE_APP_URL;

// Helper function to get the token from cookies
const getAuthToken = () => Cookies.get("authToken");

// Create a therapy appointment
export const createTherapyAppointment = async (appointmentData) => {
    const token = getAuthToken();
    const response = await axios.post(
        `${API_URL}appointment/createappointment`, // Change the URL according to your API
        appointmentData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// Get all therapy appointments for a specific user
export const getTherapyAppointmentsForUser = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}appointment/getuserappointments`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get all therapy appointments for a specific therapist
export const getTherapyAppointmentsForTherapist = async () => {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}appointment/gettherapistappointments`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Update the status of a therapy appointment
export const updateTherapyAppointmentStatus = async (appointmentId, status) => {
    const token = getAuthToken();
    const response = await axios.put(
        `${API_URL}appointment/updateappointment/${appointmentId}`, // Change the URL according to your API
        { status },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// Delete a therapy appointment
export const deleteTherapyAppointment = async (appointmentId) => {
    const token = getAuthToken();
    const response = await axios.delete(
        `${API_URL}appointment/deleteappointment/${appointmentId}`, // Change the URL according to your API
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
