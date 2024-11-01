import React, { useState } from 'react';
import axios from 'axios';
import Vultrlogo from "../../assets/images/vultr-icon.png";

const VultrChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleChat = (e) => {
    if (e.target.closest('.vultr-chatbot-toggle-btn')) {
      setIsOpen(!isOpen);
    }
  };

  const preventToggle = (e) => {
    e.stopPropagation();
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { text: userInput, sender: 'user' },
    ]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_URL}api/chat`, {
        userInput: userInput,
      });

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { text: response.data.response, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { text: 'Error occurred!', sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Icon Button */}
      <div
        className={`vultr-chatbot-toggle-btn flex items-center justify-center w-16 h-16 rounded-full cursor-pointer transition-all duration-300 ${
          isOpen ? 'w-80 h-96' : ''
        }`}
        onClick={toggleChat}
      >
        {!isOpen ? (
          <img src={Vultrlogo} alt="Vultr Chatbot" className="w-16 h-16" />
        ) : (
          <div
            className="relative flex flex-col h-full w-full bg-white rounded-lg shadow-lg"
            onClick={preventToggle} // Prevent closing when interacting with the chat
          >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-lg">
              <h4 className="text-lg font-bold">Vultr Chatbot</h4>
              <button
                className="text-2xl font-bold focus:outline-none"
                onClick={toggleChat}
              >
                ×
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`${
                    msg.sender === 'user'
                      ? 'self-end bg-gray-200 text-right'
                      : 'self-start bg-green-100 text-left'
                  } p-2 rounded-lg max-w-xs`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="text-center p-3 text-gray-500">AI is thinking...</div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center p-2 border-t border-gray-300"
            >
              <input
                type="text"
                placeholder="Enter your message"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                disabled={loading}
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VultrChatbot;
