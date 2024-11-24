import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import io from "socket.io-client";
import { Smile, Send, Users, LogOut, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createChatMessage } from "../../services/chatServices";
import { getUserProfile } from "../../services/userServices";
import Navbar from "../../components/common/Navbar";

const sentimentScores = {
  sadness: 6,
  disgust: 5,
  surprise: 4,
  fear: 3,
  anger: 2,
  neutral: 0,
  joy: 1
};

const emotionLottieUrls = {
  Sadness: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f622/lottie.json",
  Disgust: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f922/lottie.json",
  Surprise: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/lottie.json",
  Fear: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f628/lottie.json",
  Anger: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f621/lottie.json",
  Neutral: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/lottie.json",
  Joy: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/lottie.json",
  Unknown: "https://fonts.gstatic.com/s/e/notoemoji/latest/2753/lottie.json"
};

const emojiList = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "💯", "🤔", "👋", "✨", "🙌", "💪", "🎮", "🌟", "🤩"];

const getEmotionFromScore = (score) => {
  for (const [emotion, scoreValue] of Object.entries(sentimentScores)) {
    if (scoreValue === score) return emotion.charAt(0).toUpperCase() + emotion.slice(1);
  }
  return "Unknown";
};

const getRandomPosition = () => ({
  x: Math.random() * 200 - 100,
  y: Math.random() * 50 - 25,
});

const FloatingLottie = ({ emotion, onComplete }) => {
  const [lottieData, setLottieData] = useState(null);
  const randomPos = getRandomPosition();

  useEffect(() => {
    const fetchLottieData = async () => {
      try {
        const response = await fetch(emotionLottieUrls[emotion] || emotionLottieUrls.Unknown);
        const data = await response.json();
        setLottieData(data);
      } catch (error) {
        console.error("Error loading Lottie animation:", error);
      }
    };
    fetchLottieData();
  }, [emotion]);

  if (!lottieData) return null;

  return (
    <motion.div
      initial={{ y: 0, x: randomPos.x, opacity: 1, scale: 1 }}
      animate={{ 
        y: -150,
        x: randomPos.x + (Math.random() * 40 - 20),
        opacity: 0,
        scale: 2.5,
        rotate: Math.random() * 360
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 2 + Math.random(),
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-none w-16 h-16"
    >
      <Lottie
        animationData={lottieData}
        loop={true}
        autoplay={true}
      />
    </motion.div>
  );
};

const MessageBubble = ({ message, isCurrentUser, messageLottieData }) => {
  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`flex flex-col max-w-[70%] ${
          message.sender === "System" 
            ? "mx-auto bg-gray-100 rounded-lg" 
            : isCurrentUser
            ? "bg-orange-500 text-white rounded-l-2xl rounded-tr-2xl"
            : "bg-white rounded-r-2xl rounded-tl-2xl shadow-sm"
        } px-3 py-2`}
      >
        <p className="text-sm break-words">{message.text}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${
          isCurrentUser ? 'text-orange-100' : 'text-gray-400'
        }`}>
          <span className="text-xs">{message.time}</span>
          <div className="w-4 h-4">
            {message.emotion && messageLottieData[message.emotion] && (
              <Lottie
                animationData={messageLottieData[message.emotion]}
                loop={true}
                autoplay={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketId, setSocketId] = useState(null);
  const [roomCount, setRoomCount] = useState(0);
  const [userName, setUserName] = useState("Anonymous");
  const [showEmojis, setShowEmojis] = useState(false);
  const [floatingEmotions, setFloatingEmotions] = useState([]);
  const [messageLottieData, setMessageLottieData] = useState({});
  const chatEndRef = useRef(null);
  const socket = useRef(null);
  const navigate = useNavigate();

  const navigateToHome = useCallback(() => {
    const timer = setTimeout(() => navigate("/"), 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    // Pre-fetch all Lottie animations
    const fetchAllLottieData = async () => {
      const lottiePromises = Object.entries(emotionLottieUrls).map(async ([emotion, url]) => {
        try {
          const response = await fetch(url);
          const data = await response.json();
          return [emotion, data];
        } catch (error) {
          console.error(`Error loading Lottie animation for ${emotion}:`, error);
          return [emotion, null];
        }
      });

      const results = await Promise.all(lottiePromises);
      const lottieData = Object.fromEntries(results);
      setMessageLottieData(lottieData);
    };

    fetchAllLottieData();
  }, []);

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
      setRoomCount(count);
    });

    socket.current.on("message", (message) => {
      if (typeof message === "string") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            text: message, 
            sender: "System", 
            time: new Date().toLocaleTimeString(), 
            emotion: "Joy" 
          }
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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addFloatingEmotion = useCallback((emotion) => {
    const numberOfEmotions = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < numberOfEmotions; i++) {
      setTimeout(() => {
        const id = Date.now() + i;
        setFloatingEmotions(prev => [...prev, { id, emotion }]);
        
        setTimeout(() => {
          setFloatingEmotions(prev => prev.filter(e => e.id !== id));
        }, 3000);
      }, i * 200);
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
      
      addFloatingEmotion(emotion);
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
      
      addFloatingEmotion(capitalizedRandomEmotion);
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br mt-10 from-orange-50 to-orange-100">
      <Navbar />
      <div className="flex-1 flex items-start justify-center p-4 mt-16">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-3 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-white">Group Chat</h2>
              <div className="flex items-center text-orange-100 bg-orange-600/30 px-2 py-1 rounded-full text-sm">
                <Users size={14} className="mr-1" />
                <span>{roomCount}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleExitChat}
                className="flex items-center bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full text-sm"
              >
                <LogOut size={16} />
                <span className="ml-1">Exit</span>
              </button>
              <button 
                onClick={handleJoinAnotherGroup}
                className="flex items-center bg-blue-500/90 hover:bg-blue-600 text-white p-1.5 rounded-full text-sm"
              >
                <RefreshCw size={16} />
                <span className="ml-1">Join</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-orange-50 to-white relative">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Smile size={40} className="mb-2 text-orange-300" />
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  message={message}
                  isCurrentUser={message.sender === socketId}
                  messageLottieData={messageLottieData}
                />
              ))
            )}
            <div ref={chatEndRef} />
            
            <AnimatePresence>
              {floatingEmotions.map(({ id, emotion }) => (
                <FloatingLottie
                  key={id}
                  emotion={emotion}
                  onComplete={() => setFloatingEmotions(prev => prev.filter(e => e.id !== id))}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-3 flex gap-2 bg-white border-t border-gray-100">
            {showEmojis && (
              <div className="absolute bottom-16 bg-white border shadow-lg rounded-lg p-2 z-10">
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