import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, X, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Vultrlogo from "../../assets/images/vultr-icon.png";

const VultrChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

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
      const response = await axios.post(`${import.meta.env.VITE_APP_URL}vultr/chat`, {
        userInput: userInput,
      });

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { text: response.data.botMessage, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { text: 'Sorry, I encountered an error. Please try again later.', sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const LoadingIndicator = () => (
    <div className="flex items-center space-x-2 text-gray-500 bg-gray-100 rounded-lg p-3 max-w-[200px]">
      <Loader className="w-4 h-4 animate-spin" />
      <span className="text-sm">Thinking...</span>
    </div>
  );

  // Custom components for markdown rendering
  const MarkdownComponents = {
    p: ({ children }) => <p className="text-sm md:text-base mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="list-disc ml-4 mb-2 text-sm md:text-base">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 text-sm md:text-base">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    h1: ({ children }) => <h1 className="text-lg md:text-xl font-bold mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base md:text-lg font-bold mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm md:text-base font-bold mb-2">{children}</h3>,
    code: ({ inline, className, children }) => {
      if (inline) {
        return <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">{children}</code>;
      }
      return (
        <pre className="bg-gray-200 p-2 rounded-lg mb-2 overflow-x-auto">
          <code className={className}>{children}</code>
        </pre>
      );
    },
    pre: ({ children }) => <>{children}</>,
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`vultr-chatbot-toggle-btn transition-all duration-300 ${
          isOpen ? 'w-[90vw] h-[80vh] md:w-[400px] md:h-[600px]' : ''
        }`}
        onClick={toggleChat}
      >
        {!isOpen ? (
          <div className="cursor-pointer transform hover:scale-110 transition-transform duration-200">
            <img 
              src={Vultrlogo} 
              alt="Vultr Chatbot" 
              className="w-16 h-16 drop-shadow-lg hover:drop-shadow-xl"
            />
          </div>
        ) : (
          <div
            className="relative flex flex-col h-full w-full bg-white rounded-xl shadow-2xl"
            onClick={preventToggle}
          >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-xl">
              <div className="flex items-center space-x-3">
                <img src={Vultrlogo} alt="Vultr" className="w-8 h-8" />
                <h4 className="text-lg font-semibold">Vultr Assistant</h4>
              </div>
              <button
                className="hover:bg-gray-700 p-1.5 rounded-lg transition-colors"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Welcome Message */}
            <div 
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              {chatHistory.length === 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-4 rounded-xl rounded-bl-none max-w-[80%]">
                    <p className="text-sm md:text-base">
                      👋 Hello! I'm your Vultr Assistant. How can I help you today?
                    </p>
                  </div>
                </div>
              )}
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <ReactMarkdown 
                      components={MarkdownComponents}
                      className={`prose ${msg.sender === 'user' ? 'prose-invert' : ''} max-w-none`}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <LoadingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base placeholder-gray-400"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={loading || !userInput.trim()}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VultrChatbot;