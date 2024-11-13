import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const TherapyAI = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { text: userInput, sender: 'user' };
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}therapy/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      const botMessage = { text: data.response, sender: 'bot' };
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

  // Custom components for markdown rendering
  const MarkdownComponents = {
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
    code: ({ children }) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-100 p-2 rounded mb-2 overflow-x-auto">
        {children}
      </pre>
    ),
  };

  return (
    <div className="flex flex-col h-3/4 max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-orange-600 p-4 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">🤖</span> Feelix
        </h1>
        <p className="text-orange-100">Your AI Therapy Companion</p>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-orange-50 scroll-smooth"
      >
        <div className="space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg">Welcome to Feelix! 👋</p>
              <p className="text-sm">How are you feeling today?</p>
            </div>
          )}
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-br-none'
                    : 'bg-white shadow-md rounded-bl-none'
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
              <div className="bg-white p-4 rounded-lg shadow-md rounded-bl-none">
                <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || loading}
            className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TherapyAI;