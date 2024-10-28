import React, { useState } from "react";
import Cookies from "js-cookie";
import { Music, Pause, Play, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactEmojis from "@souhaildev/reactemojis";
import Navbar from "../../components/common/Navbar";

const MoodMeter = () => {
  const [songData, setSongData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const fetchSongRecommendation = async () => {
    try {
      if (audio) {
        audio.pause();
        audio.removeEventListener("ended", () => setIsPlaying(false));
        setAudio(null);
        setIsPlaying(false);
      }

      setIsLoading(true);
      const token = Cookies.get("authToken");

      const response = await fetch(
        `${import.meta.env.VITE_APP_URL}spotify/recommend-song`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch song recommendation");

      const data = await response.json();
      setSongData(data);

      if (data.previewUrl) {
        const audioObj = new Audio(data.previewUrl);
        audioObj.addEventListener("ended", () => setIsPlaying(false));
        setAudio(audioObj);
      }
    } catch (error) {
      console.error("Error fetching song recommendation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Failed to play the song:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const getMoodEmoji = (sentiment) => {
    const moods = {
      joy: { emoji: "😊", color: "#FFD700", size: "w-48 h-48" },
      sadness: { emoji: "😢", color: "#87CEEB", size: "w-48 h-48" },
      anger: { emoji: "😠", color: "#FF4500", size: "w-48 h-48" },
      neutral: { emoji: "😐", color: "#E6E6FA", size: "w-48 h-48" },
      surprise: { emoji: "🎉", color: "#FF69B4", size: "w-48 h-48" },
      fear: { emoji: "😨", color: "#98FB98", size: "w-48 h-48" },
      disgust: { emoji: "🤢", color: "#9370DB", size: "w-48 h-48" },
    };

    return (
      moods[sentiment?.toLowerCase()] || {
        emoji: "🎵",
        color: "#FFB6C1",
        size: "w-48 h-48",
      }
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-24 bg-gradient-to-br from-orange-600 via-orange-400 to-orange-400 p-4 sm:p-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <header className="backdrop-blur-md bg-white/10 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Music className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Mood Meter
                </h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchSongRecommendation}
                disabled={isLoading}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl flex items-center gap-3 text-white font-medium backdrop-blur-sm transition-all"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
                Get New Song
              </motion.button>
            </div>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatePresence mode="wait">
              <motion.section
                key="mood"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-xl"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Current Mood
                </h2>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="p-8 rounded-xl text-center"
                  >
                    <div className="flex justify-center items-center mb-4">
                      <div
                        className={
                          getMoodEmoji(songData?.dominantSentiment).size
                        }
                      >
                        <ReactEmojis
                          emoji={
                            getMoodEmoji(songData?.dominantSentiment).emoji
                          }
                          emojiStyle="2"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    </div>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-medium text-white capitalize inline-block"
                    >
                      {songData?.dominantSentiment ||
                        "Click to get recommendation"}
                    </motion.span>
                  </motion.div>
                )}
              </motion.section>

              <motion.section
                key="song"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-xl"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Recommended Song
                </h2>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                ) : songData ? (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 backdrop-blur-sm p-6 rounded-xl"
                    >
                      <h3 className="text-2xl font-medium text-white mb-2 truncate">
                        {songData.songName || "Unknown Track"}
                      </h3>
                      <p className="text-xl text-white/80 truncate">
                        {songData.artistName || "Unknown Artist"}
                      </p>
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlayPause}
                      disabled={!songData.previewUrl}
                      className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center gap-3 text-white font-medium backdrop-blur-sm transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                      {isPlaying ? "Pause Preview" : "Play Preview"}
                    </motion.button>

                    {songData.songUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl overflow-hidden shadow-2xl"
                      >
                        <iframe
                          src={`https://open.spotify.com/embed/track/${songData.songUrl
                            .split("/")
                            .pop()}?utm_source=generator&theme=0`}
                          width="100%"
                          height="352"
                          allow="encrypted-media"
                          className="rounded-xl"
                        />
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center py-12">
                    <span className="text-white">No song recommended yet!</span>
                  </div>
                )}
              </motion.section>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MoodMeter;
