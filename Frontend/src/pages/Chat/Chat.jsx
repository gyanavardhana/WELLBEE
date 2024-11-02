import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/common/Navbar";
import io from "socket.io-client";
import { createChatMessage } from "../../services/chatServices";
import { getUserProfile } from "../../services/userServices";
import { Smile, Send, Users } from "lucide-react";

const sentimentScores = {
  sadness: 6,
  disgust: 5,
  surprise: 4,
  fear: 3,
  anger: 2,
  neutral: 0,
  joy: 1,
};

const emotionEmojis = {
  Sadness: "😢",
  Disgust: "🤢",
  Surprise: "😮",
  Fear: "😨",
  Anger: "😠",
  Neutral: "😐",
  Joy: "😊",
  Unknown: "❓"
};

const emojiList = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "💯", "🤔", "👋", "✨", "🙌", "💪", "🎮", "🌟", "🤩"];

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
  const [showEmojis, setShowEmojis] = useState(false);
  const chatEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3001");

    socket.current.on("connect", () => {
      setSocketId(socket.current.id);
      // Add system welcome message
      const welcomeMessage = {
        text: "Welcome to the chat! Express yourself freely - we'll analyze your emotions as you chat.",
        sender: "System",
        time: new Date().toLocaleTimeString(),
        emotion: "Joy"
      };
      setMessages(prev => [...prev, welcomeMessage]);
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

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojis(false);
  };

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
          msg.sender !== "System" && msg.text === newMessageObject.text && msg.sender === socketId
            ? { ...msg, emotion: capitalizedRandomEmotion }
            : msg
        )
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">Group Chat</h2>
              <div className="flex items-center text-orange-100 bg-orange-600/30 px-3 py-1 rounded-full">
                <Users size={16} className="mr-2" />
                <span className="text-sm">{roomCount}</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-orange-50 to-white">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Smile size={48} className="mb-2 text-orange-300" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 max-w-[80%] ${
                    message.sender === socketId ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`rounded-2xl p-4 shadow-sm ${
                      message.sender === "System"
                        ? "bg-gradient-to-r from-gray-100 to-gray-200 text-center mx-auto"
                        : message.sender === socketId
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                        : "bg-gradient-to-r from-gray-200 to-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {message.sender === "System" ? "System" : message.sender === socketId ? "You" : userName}
                      </span>
                      <span className="text-2xl" title={message.emotion}>
                        {emotionEmojis[message.emotion]}
                      </span>
                    </div>
                    <p className="mb-1">{message.text}</p>
                    <p className={`text-xs ${message.sender === socketId ? "text-orange-100" : "text-gray-600"}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 border-t border-orange-100">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full border border-orange-200 rounded-full px-6 py-3 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600"
                  onClick={() => setShowEmojis(!showEmojis)}
                >
                  <Smile size={24} />
                </button>
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors duration-200"
              >
                <Send size={24} />
              </button>
            </form>

            {/* Emoji Picker */}
            {showEmojis && (
              <div className="absolute bottom-20 right-4 bg-white p-4 rounded-xl shadow-lg border border-orange-200">
                <div className="grid grid-cols-5 gap-2">
                  {emojiList.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-2xl hover:bg-orange-100 p-2 rounded-lg transition-colors duration-200"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;