import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/common/Navbar";
import io from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sentimentScore, setSentimentScore] = useState(null);
  const [socketId, setSocketId] = useState(null); // Store the current user's socket ID
  const chatEndRef = useRef(null);

  const socket = useRef(null);

  // Connect to WebSocket server
  useEffect(() => {
    socket.current = io("http://localhost:3001"); // Replace with your server URL if different

    // Get the unique socket ID for the connected user
    socket.current.on("connect", () => {
      setSocketId(socket.current.id); // Store socket ID when connected
    });

    // Join a chat room
    socket.current.emit("joinRoom");

    // Listen for incoming messages
    socket.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up on unmount
    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // Create a new message object with the user's socket ID
    const newMessageObject = {
      text: newMessage,
      sender: socketId, // Include sender ID
      time: new Date().toLocaleTimeString(),
    };

    // Emit the message to the server
    socket.current.emit("sendMessage", newMessageObject);

    // Mock sentiment score calculation
    const randomSentiment = Math.random() * 10;
    setSentimentScore(randomSentiment.toFixed(2));

    setNewMessage(""); // Clear input field
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-orange-100 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          {/* Chat Header with Sentiment Score */}
          <div className="bg-orange-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-orange-600">Anonymous Group Chat</h2>
            {sentimentScore && (
              <div className="bg-orange-400 text-white px-4 py-1 rounded-full shadow">
                Sentiment Score: {sentimentScore}
              </div>
            )}
          </div>

          {/* Message History */}
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
                    {message.sender === socketId ? "You" : "Anonymous"}
                  </p>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-gray-500">{message.time}</p>
                </div>
              ))
            )}
            <div ref={chatEndRef}></div> {/* Reference to scroll to the bottom */}
          </div>

          {/* Chatbox for new message */}
          <div className="bg-white p-4 border-t border-orange-200">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                className="flex-1 border border-orange-300 rounded-lg px-4 py-2 mr-4 focus:outline-none focus:border-orange-500"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
              >
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