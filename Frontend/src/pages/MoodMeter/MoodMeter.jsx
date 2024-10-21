import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
const MoodMeter = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [curatedSongs, setCuratedSongs] = useState([
    { id: 1, title: "Calm Waves", artist: "Relaxation Co." },
    { id: 2, title: "Upbeat Vibes", artist: "Feel Good Inc." },
    { id: 3, title: "Mellow Beats", artist: "Chillstep" },
  ]);
  const [isPlaying, setIsPlaying] = useState(null);

  const handleMoodChange = (e) => {
    setSelectedMood(e.target.value);
    // Logic to fetch curated songs based on mood could go here
  };

  const togglePlayPause = (id) => {
    if (isPlaying === id) {
      setIsPlaying(null); // Pause the current song
    } else {
      setIsPlaying(id); // Play the selected song
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-orange-100 p-8 mt-24 flex flex-col items-center">
      <header className="w-full flex justify-between items-center p-4 bg-orange-300 shadow-md rounded mb-8">
        <h1 className="text-3xl text-orange-800">Mood Meter</h1>
        <div className="flex items-center space-x-4">
          {/* User profile could be added here */}
        </div>
      </header>

      <section className="w-full max-w-lg mb-8">
        <h2 className="text-xl text-orange-800 mb-4">Select Your Current Mood</h2>
        <form className="bg-orange-200 p-4 rounded shadow-md">
          <select
            value={selectedMood}
            onChange={handleMoodChange}
            className="w-full p-2 text-orange-800 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="" disabled>
              Choose a mood...
            </option>
            <option value="happy">Happy</option>
            <option value="calm">Calm</option>
            <option value="sad">Sad</option>
            <option value="energetic">Energetic</option>
          </select>
        </form>
      </section>

      <section className="w-full max-w-lg">
        <h2 className="text-xl text-orange-800 mb-4">Curated Music</h2>
        <div className="bg-orange-200 p-4 rounded shadow-md space-y-4">
          {curatedSongs.map((song) => (
            <div
              key={song.id}
              className="flex justify-between items-center p-2 bg-orange-50 rounded shadow-sm"
            >
              <div>
                <h3 className="text-orange-800 font-medium">{song.title}</h3>
                <p className="text-orange-600">{song.artist}</p>
              </div>
              <button
                onClick={() => togglePlayPause(song.id)}
                className={`px-4 py-2 rounded text-orange-100 ${
                  isPlaying === song.id ? "bg-orange-700" : "bg-orange-500"
                }`}
              >
                {isPlaying === song.id ? "Pause" : "Play"}
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
    </>
    
  );
};

export default MoodMeter;
