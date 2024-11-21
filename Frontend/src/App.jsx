import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import MoodMeter from "./pages/MoodMeter/MoodMeter";
import Therapy from "./pages/Therapy/Therapy";
import Chat from "./pages/Chat/Chat";
import Dashboard from "./pages/Dashboard/Dashboard";
import Chatbot from "./chat";
import VultrChatbot from "./vultrbot";
import Profile from "./pages/Profile/Profile";
import Generator from "./components/dashboard/Generator";
import "./index.css";

const App = () => {
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const apiUrl = import.meta.env.VITE_APP_URL;
        const socketUrl = import.meta.env.VITE_APP_SOCKET_URL;

        if (apiUrl) {
          const apiResponse = await fetch(apiUrl);
          const apiData = await apiResponse.json();
          console.log("API Response:", apiData);
        } else {
          console.warn("VITE_APP_URL is not defined in your environment variables.");
        }

        if (socketUrl) {
          const socketResponse = await fetch(socketUrl);
          const socketData = await socketResponse.json();
          console.log("Socket Response:", socketData);
        } else {
          console.warn("VITE_APP_SOCKET_URL is not defined in your environment variables.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUrls();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/moodmeter" element={<MoodMeter />} />
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/x" element={<Generator />} />
      </Routes>
    </>
  );
};

export default App;
