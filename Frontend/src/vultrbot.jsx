import React, { useState } from 'react';
import axios from 'axios';

const VultrChatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput) return;

    const newMessage = { text: userInput, sender: 'user' };
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/chat', {
        userInput: userInput
      });

      const botMessageContent = response.data.botMessage;
      const botMessage = { text: botMessageContent, sender: 'bot' };
      setChatHistory((prevHistory) => [...prevHistory, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
      <div style={{ width: '400px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Vultr Chatbot</h1>
        <div style={{ height: '300px', overflowY: 'scroll', marginBottom: '20px' }}>
          {chatHistory.map((msg, index) => (
            <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', padding: '10px', borderRadius: '10px', backgroundColor: msg.sender === 'user' ? '#f0f0f0' : '#e0f0e0', marginBottom: '5px' }}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', backgroundColor: '#e0f0e0', marginBottom: '5px' }}>
              <img src="loader.gif" alt="Loading..." width="50" />
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
          <input
            type="text"
            placeholder="Enter your message"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}
          />
          <button type="submit" style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default VultrChatbot;
