import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/common/Navbar";
import io from "socket.io-client";
import { createChatMessage } from "../../services/chatServices";
import { getUserProfile } from "../../services/userServices";



const sentimentScores = {
  sadness: 6,
  disgust: 5,
  surprise: 4,
  fear: 3,
  anger: 2,
  neutral: 0,
  joy: 1,
};

const getEmotionFromScore = (score) => {
  for (const [emotion, scoreValue] of Object.entries(sentimentScores)) {
    if (scoreValue === score) {
      return emotion.charAt(0).toUpperCase() + emotion.slice(1);
    }
  }
  return "Unknown";
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketId, setSocketId] = useState(null);
  const [roomCount, setRoomCount] = useState(0);
  const [userName, setUserName] = useState("Anonymous");
  const chatEndRef = useRef(null);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3001");

    socket.current.on("connect", () => {
      setSocketId(socket.current.id);
    });

    socket.current.emit("joinRoom");

    socket.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.current.on("roomCount", (count) => {
      setRoomCount(count);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getUserProfile();
        setUserName(user.name);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMessageObject = {
      text: newMessage,
      sender: socketId,
      time: new Date().toLocaleTimeString(),
      emotion: "Unknown",
    };

    socket.current.emit("sendMessage", newMessageObject);
    setNewMessage("");

    try {
      const response = await createChatMessage(newMessage);
      const sentimentScore = response.sentimentScore;
      const emotion = getEmotionFromScore(sentimentScore) || "Unknown";

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>

          msg.text === newMessageObject.text && msg.sender === socketId
            ? { ...msg, emotion }
            : msg
        )
      );
    } catch (error) {
      console.error("Error creating chat message:", error);
      const randomEmotion = Object.keys(sentimentScores)[Math.floor(Math.random() * Object.keys(sentimentScores).length)];
      const capitalizedRandomEmotion = randomEmotion.charAt(0).toUpperCase() + randomEmotion.slice(1);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.sender!="System" && msg.text === newMessageObject.text && msg.sender === socketId
            ? { ...msg, emotion: capitalizedRandomEmotion }
            : msg
        )
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-orange-100 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <div className="bg-orange-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-orange-600">Anonymous Group Chat</h2>
            <p className="text-sm text-gray-600">Users in room: {roomCount}</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-orange-50">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded-lg ${
                    message.sender === socketId ? "bg-orange-200 text-right ml-auto" : "bg-orange-300 text-left mr-auto"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {message.sender === "System" ? "System" : message.sender === socketId ? "You" : userName}
                  </p>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-gray-500">{message.time}</p>
                  <p className="text-xs text-gray-600">Emotion: {message.emotion}</p>
    
                </div>
              ))
            )}
            <div ref={chatEndRef}></div>
          </div>

          <div className="bg-white p-4 border-t border-orange-200">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                className="flex-1 border border-orange-300 rounded-lg px-4 py-2 mr-4 focus:outline-none focus:border-orange-500"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
