import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import { Smile, Send, Users, LogOut, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createChatMessage } from "../../services/chatServices";
import { getUserProfile } from "../../services/userServices";
import Navbar from "../../components/common/Navbar";

const sentimentScores = { sadness: 6, disgust: 5, surprise: 4, fear: 3, anger: 2, neutral: 0, joy: 1 };
const emotionEmojis = { Sadness: "😢", Disgust: "🤢", Surprise: "😮", Fear: "😨", Anger: "😠", Neutral: "😐", Joy: "😊", Unknown: "❓" };
const emojiList = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "💯", "🤔", "👋", "✨", "🙌", "💪", "🎮", "🌟", "🤩"];

const getEmotionFromScore = (score) => {
  for (const [emotion, scoreValue] of Object.entries(sentimentScores)) {
    if (scoreValue === score) return emotion.charAt(0).toUpperCase() + emotion.slice(1);
  }
  return "Unknown";
};

const getRandomPosition = () => ({
  x: Math.random() * 200 - 100, // Random x position between -100 and 100
  y: Math.random() * 50 - 25,   // Random y position between -25 and 25
});

const FloatingEmoji = ({ emoji, onComplete }) => {
  const randomPos = getRandomPosition();
  
  return (
    <motion.div
      initial={{ y: 0, x: randomPos.x, opacity: 1, scale: 1 }}
      animate={{ 
        y: -150,
        x: randomPos.x + (Math.random() * 40 - 20), // Add some random horizontal movement
        opacity: 0,
        scale: 2.5,
        rotate: Math.random() * 360 // Random rotation
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 2 + Math.random(), // Random duration between 2-3 seconds
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-none text-4xl"
    >
      {emoji}
    </motion.div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketId, setSocketId] = useState(null);
  const [roomCount, setRoomCount] = useState(0);
  const [userName, setUserName] = useState("Anonymous");
  const [showEmojis, setShowEmojis] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const chatEndRef = useRef(null);
  const socket = useRef(null);
  const navigate = useNavigate();

  const navigateToHome = useCallback(() => {
    const timer = setTimeout(() => navigate("/"), 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_APP_SOCKET_URL}`);

    socket.current.on("connect", () => {
      setSocketId(socket.current.id);
      const welcomeMessage = {
        text: "Welcome to the chat! Express yourself freely - we'll analyze your emotions as you chat.",
        sender: "System",
        time: new Date().toLocaleTimeString(),
        emotion: "Joy"
      };
      setMessages((prev) => [...prev, welcomeMessage]);
    });

    socket.current.emit("joinRoom");
    socket.current.on("roomCount", (count) => {
      console.log(`Room count updated: ${count}`);
      setRoomCount(count);
    });

    socket.current.on("message", (message) => {
      if (typeof message === "string") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, sender: "System", time: new Date().toLocaleTimeString(), emotion: "Joy" }
        ]);
      } else {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
      socket.current.emit("leaveRoom");
      socket.current.disconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.current.disconnect();
      window.removeEventListener("beforeunload", handleBeforeUnload);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addFloatingEmoji = useCallback((emotion) => {
    const numberOfEmojis = Math.floor(Math.random() * 3) + 2; // Random number between 2-4 emojis
    const emoji = emotionEmojis[emotion] || "❓";
    
    for (let i = 0; i < numberOfEmojis; i++) {
      setTimeout(() => {
        const id = Date.now() + i;
        setFloatingEmojis(prev => [...prev, { id, emoji }]);
        
        setTimeout(() => {
          setFloatingEmojis(prev => prev.filter(e => e.id !== id));
        }, 3000); // Increased duration to match the longer animation
      }, i * 200); // Stagger the appearance of emojis
    }
  }, []);

  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji);
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
      
      addFloatingEmoji(emotion);
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
      
      addFloatingEmoji(capitalizedRandomEmotion);
    }
  };

  const handleExitChat = () => {
    socket.current.emit("leaveRoom");
    setRoomCount(0);
    navigateToHome();
  };

  const handleJoinAnotherGroup = () => {
    if (roomCount === 5) {
      window.open(window.location.href, "_blank");
    }
  };

  return (
    <div className="flex flex-col min-h-screen mt-10 bg-gradient-to-br from-orange-50 to-orange-100">
      <Navbar />
      <div className="flex-1 flex items-start justify-center p-4 mt-16 md:mt-20">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-3 md:p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg md:text-xl font-bold text-white">Group Chat</h2>
              <div className="flex items-center text-orange-100 bg-orange-600/30 px-2 md:px-3 py-1 rounded-full">
                <Users size={16} className="mr-1 md:mr-2" />
                <span className="text-sm">{roomCount}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleExitChat} className="flex items-center bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                <LogOut size={20} /> <span className="ml-1">Exit</span>
              </button>
              <button onClick={handleJoinAnotherGroup} className="flex items-center bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                <RefreshCw size={20} /> <span className="ml-1">Join Another Group</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 md:p-4 overflow-y-auto bg-gradient-to-b from-orange-50 to-white relative">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Smile size={48} className="mb-2 text-orange-300" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 md:mb-4 max-w-[85%] md:max-w-[80%] ${
                    message.sender === socketId ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`rounded-2xl p-3 md:p-4 shadow-sm ${
                      message.sender === "System"
                        ? "bg-gradient-to-r from-gray-100 to-gray-200 text-center mx-auto"
                        : message.sender === socketId
                        ? "bg-orange-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    <p>{message.text}</p>
                    <div className="text-xs text-gray-500">
                       <span>{message.time}</span>
                      <span className="ml-2 text-lg">{emotionEmojis[message.emotion] || "❓"}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
            
            {/* Floating Emojis */}
            <AnimatePresence>
              {floatingEmojis.map(({ id, emoji }) => (
                <FloatingEmoji
                  key={id}
                  emoji={emoji}
                  onComplete={() => setFloatingEmojis(prev => prev.filter(e => e.id !== id))}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Input Section */}
          <form className="p-3 md:p-4 flex gap-2" onSubmit={handleSendMessage}>
            {showEmojis && (
              <div className="absolute bottom-16 bg-white border rounded-md p-2 z-10 text-2xl">
                <div className="grid grid-cols-5 gap-2">
                  {emojiList.map((emoji) => (
                    <span
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="cursor-pointer hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg p-2"
            />
            <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="p-2">
              <Smile size={24} />
            </button>
            <button type="submit" className="bg-orange-500 text-white rounded-lg px-4 py-2 hover:bg-orange-600">
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;