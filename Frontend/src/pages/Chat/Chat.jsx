import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../components/common/Navbar";
import io from "socket.io-client";
import { createChatMessage } from "../../services/chatServices";
import { getUserProfile } from "../../services/userServices";
import { Smile, Send, Users, LogOut, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sentimentScores = { sadness: 6, disgust: 5, surprise: 4, fear: 3, anger: 2, neutral: 0, joy: 1 };
const emotionEmojis = { Sadness: "😢", Disgust: "🤢", Surprise: "😮", Fear: "😨", Anger: "😠", Neutral: "😐", Joy: "😊", Unknown: "❓" };
const emojiList = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "💯", "🤔", "👋", "✨", "🙌", "💪", "🎮", "🌟", "🤩"];

const getEmotionFromScore = (score) => {
  for (const [emotion, scoreValue] of Object.entries(sentimentScores)) {
    if (scoreValue === score) return emotion.charAt(0).toUpperCase() + emotion.slice(1);
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
  const navigate = useNavigate();

  const navigateToHome = useCallback(() => {
    const timer = setTimeout(() => navigate("/"), 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    socket.current = io("http://localhost:3001");

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
        // Handle system message for users joining
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, sender: "System", time: new Date().toLocaleTimeString(), emotion: "Joy" }
        ]);
      } else {
        // Handle regular chat messages
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Alert prompt for user
      socket.current.emit("leaveRoom"); // Emit a 'leaveRoom' event to decrease the count on reload
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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleExitChat = () => {
    socket.current.emit("leaveRoom");
    //update room count
    setRoomCount(0);
    navigateToHome();
  };

  const handleJoinAnotherGroup = () => {
    if (roomCount === 5) {
      window.open(window.location.href, "_blank");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
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
          <div className="flex-1 p-3 md:p-4 overflow-y-auto bg-gradient-to-b from-orange-50 to-white">
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
                      <span>{message.sender}</span> &bull; <span>{message.time}</span>
                      <span className="ml-2">{emotionEmojis[message.emotion] || "❓"}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Section */}
          <form className="p-3 md:p-4 flex gap-2" onSubmit={handleSendMessage}>
            {showEmojis && (
              <div className="absolute bg-white border rounded-md p-2 z-10">
                {emojiList.map((emoji) => (
                  <span key={emoji} onClick={() => handleEmojiClick(emoji)} className="cursor-pointer">
                    {emoji}
                  </span>
                ))}
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
              <Smile size={20} />
            </button>
            <button type="submit" className="bg-orange-500 text-white rounded-lg px-4 py-2 hover:bg-orange-600">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
