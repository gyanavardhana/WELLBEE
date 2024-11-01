import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_APP_URL;

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the authorization token
axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("authToken"); // Replace 'authToken' with the actual cookie name

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Service to create a new chat message
export const createChatMessage = async (message) => {
    try {
        const response = await axiosInstance.post('/chat/chatmessages', { message });
        console.log(response.data.newChatMessage);
        return response.data.newChatMessage;
    } catch (error) {
        console.error("Error creating chat message:", error);
        throw new Error(error.response?.data?.error || "Failed to create chat message");
    }
};

// Service to get all chat messages for the logged-in user
export const getUserChatMessages = async () => {
    try {
        const response = await axiosInstance.get('/chat/chatmessages');
        return response.data.chatMessages;
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        throw new Error(error.response?.data?.error || "Failed to fetch chat messages");
    }
};

// Service to delete a specific chat message
export const deleteChatMessage = async (messageId) => {
    try {
        const response = await axiosInstance.delete(`/chat/chatmessages/${messageId}`);
        return response.data.message;
    } catch (error) {
        console.error("Error deleting chat message:", error);
        throw new Error(error.response?.data?.error || "Failed to delete chat message");
    }
};

// Service to delete all chat messages for the logged-in user
export const deleteAllUserChatMessages = async () => {
    try {
        const response = await axiosInstance.delete('/chat/allmessages');
        return response.data.message;
    } catch (error) {
        console.error("Error deleting all chat messages:", error);
        throw new Error(error.response?.data?.error || "Failed to delete all chat messages");
    }
};
