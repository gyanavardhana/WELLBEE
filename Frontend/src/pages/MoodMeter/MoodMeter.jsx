import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Music, Pause, Play, Loader2, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import Navbar from "../../components/common/Navbar";

const MoodMeter = () => {
  const [songData, setSongData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [audioError, setAudioError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [lottieData, setLottieData] = useState(null);



  useEffect(() => {
    const fetchLottieData = async () => {
      if (songData?.dominantSentiment) {
        try {
          const response = await fetch(getMoodEmoji(songData.dominantSentiment).lottieUrl);
          const data = await response.json();
          setLottieData(data);
        } catch (error) {
          console.error("Error loading Lottie animation:", error);
        }
      }
    };

    fetchLottieData();
  }, [songData?.dominantSentiment]);
  const handleAudioEnd = () => {
    setIsPlaying(false);
    setAudioLoading(false);
  };

  const handleAudioError = () => {
    setAudioError(true);
    setIsPlaying(false);
    setAudioLoading(false);
  };

  const handleCanPlayThrough = () => {
    setAudioLoading(false);
    setAudioError(false);
  };

  const setupAudioListeners = (audioObj) => {
    audioObj.addEventListener("ended", handleAudioEnd);
    audioObj.addEventListener("error", handleAudioError);
    audioObj.addEventListener("canplaythrough", handleCanPlayThrough);
    return audioObj;
  };

  const fetchSongRecommendation = async () => {
    try {
      // Reset states
      if (audio) {
        audio.pause();
        audio.removeEventListener("ended", handleAudioEnd);
        audio.removeEventListener("error", handleAudioError);
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
        setAudio(null);
      }
      setIsPlaying(false);
      setAudioError(false);
      setAudioLoading(false);
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
        setupAudioListeners(audioObj);
        setAudio(audioObj);
      }
    } catch (error) {
      console.error("Error fetching song recommendation:", error);
      setAudioError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!audio || audioError) return;

    try {
      setAudioLoading(true);

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Failed to play the song:", error);
              setAudioError(true);
              setIsPlaying(false);
            });
        }
      }
    } finally {
      setAudioLoading(false);
    }
  };

  const getPlayButtonContent = () => {
    if (audioLoading) {
      return (
        <>
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
          Loading...
        </>
      );
    }
    if (audioError) {
      return (
        <>
          <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
          Preview Unavailable
        </>
      );
    }
    if (isPlaying) {
      return (
        <>
          <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
          Pause Preview
        </>
      );
    }
    return (
      <>
        <Play className="w-5 h-5 sm:w-6 sm:h-6" />
        Play Preview
      </>
    );
  };

  const getMoodEmoji = (sentiment) => {
    const moods = {
      joy: {
        lottieUrl:
          "https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/lottie.json",
        color: "#FFD700",
        size: "w-24 h-24 sm:w-48 sm:h-48",
      },
      sadness: {
        lottieUrl:
          "https://fonts.gstatic.com/s/e/notoemoji/latest/1f622/lottie.json",
        color: "#87CEEB",
        size: "w-24 h-24 sm:w-48 sm:h-48",
      },
      anger: {
        lottieUrl:
          "https://fonts.gstatic.com/s/e/notoemoji/latest/1f621/lottie.json",
        color: "#FF4500",
        size: "w-24 h-24 sm:w-48 sm:h-48",
      },
      neutral: {
        lottieUrl:
          "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/lottie.json",
        color: "#E6E6FA",
        size: "w-24 h-24 sm:w-48 sm:h-48",
      },
      surprise: {
        lottieUrl:
          "https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/lottie.json",
        color: "#FF69B4",
        size: "w-24 h-24 sm:w-48 sm:h-48",
      },
      fear: {
        lottieUrl:
          "https://fonts.gstatic.com/s/e/notoemoji/latest/1f628/lottie.json",
        color: "#98FB98",
        size: "w-24 h-24 sm:w-48 sm:h-48",
      },
      disgust: {
        lottieUrl:
          "https://fonts.gstatic.com/s/e/notoemoji/latest/1f922/lottie.json",
        color: "#9370DB",
        size: "w-24 h-24 sm:w-48 sm:h-48",
      },
    };

    const defaultMood = {
      lottieUrl:
        "https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/lottie.json",
      color: "#FFB6C1",
      size: "w-24 h-24 sm:w-48 sm:h-48",
    };

    return moods[sentiment?.toLowerCase()] || defaultMood;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-24 bg-gradient-to-br from-purple-900 via-purple-600 to-pink-500 p-4 sm:p-8 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <header className="backdrop-blur-md bg-white/10 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Music className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Mood Meter
                </h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchSongRecommendation}
                disabled={isLoading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 hover:bg-white/30 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 text-white font-medium backdrop-blur-sm transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
                Get New Song
              </motion.button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <AnimatePresence mode="wait">
              <motion.section
                key="mood"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="backdrop-blur-md bg-white/10 p-6 sm:p-8 rounded-lg sm:rounded-2xl shadow-xl"
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
                  Current Mood
                </h2>
                {isLoading ? (
                  <div className="flex justify-center py-8 sm:py-12">
                    <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-spin" />
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="p-6 sm:p-8 rounded-xl text-center"
                  >
                    <div className="flex justify-center items-center mb-3 sm:mb-4">
                      <div className="w-24 h-24 sm:w-48 sm:h-48">
                        {lottieData && (
                          <Lottie
                            animationData={lottieData}
                            loop={true}
                            autoplay={true}
                          />
                        )}
                      </div>
                    </div>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl sm:text-3xl font-medium text-white capitalize inline-block"
                    >
                      {songData?.dominantSentiment || "Click to get recommendation"}
                    </motion.span>
                  </motion.div>
                )}
              </motion.section>

              {/* Song Section - remains exactly the same as in your original code */}
              <motion.section
                key="song"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="backdrop-blur-md bg-white/10 p-6 sm:p-8 rounded-lg sm:rounded-2xl shadow-xl"
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
                  Recommended Song
                </h2>
                {isLoading ? (
                  <div className="flex justify-center py-8 sm:py-12">
                    <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-spin" />
                  </div>
                ) : songData ? (
                  <div className="space-y-4 sm:space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl"
                    >
                      <h3 className="text-xl sm:text-2xl font-medium text-white mb-1 sm:mb-2 truncate">
                        {songData.songName || "Unknown Track"}
                      </h3>
                      <p className="text-lg sm:text-xl text-white/80 truncate">
                        {songData.artistName || "Unknown Artist"}
                      </p>
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlayPause}
                      disabled={!songData.previewUrl || audioLoading}
                      className={`w-full py-3 sm:py-4 ${
                        audioError 
                          ? "bg-red-500/20 hover:bg-red-500/30" 
                          : "bg-white/20 hover:bg-white/30"
                      } rounded-lg sm:rounded-xl flex justify-center items-center gap-2 sm:gap-3 text-white font-medium backdrop-blur-sm transition-all disabled:opacity-50`}
                    >
                      {getPlayButtonContent()}
                    </motion.button>

                    {songData.songUrl && (
                      <iframe
                        src={`https://open.spotify.com/embed/track/${songData.songUrl.split("/").pop()}?utm_source=generator&theme=0`}
                        width="100%"
                        height="352"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-xl"
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-center text-white/70">
                    Click &quot;Get New Song&quot; to discover a mood-based song!
                  </p>
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