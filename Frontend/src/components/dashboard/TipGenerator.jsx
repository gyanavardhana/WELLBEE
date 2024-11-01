import React, { useEffect, useState, useRef } from "react";
import {
  createExerciseTip,
  getExerciseTips,
  updateExerciseTip,
  deleteExerciseTip,
  getExerciseRecommendations,
} from "../../services/tipServices";
import { getHealthInfo } from "../../services/nutritionServices";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaRunning,
  FaDumbbell,
  FaListAlt,
  FaInfoCircle,
} from "react-icons/fa";

const TipGenerator = () => {
  const [activeSection, setActiveSection] = useState("tips");
  const [tips, setTips] = useState([]);
  const [newTip, setNewTip] = useState("");
  const [editTipId, setEditTipId] = useState(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [foodItem, setFoodItem] = useState("");
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [healthInfo, setHealthInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingHealthInfo, setLoadingHealthInfo] = useState(false);
  const tipsRef = useRef([]);

  // Debounce function to prevent too many database calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    const data = await getExerciseTips();
    setTips(data);
    tipsRef.current = data;
  };

  const debouncedUpdateTip = debounce(async (tipId, updatedTip) => {
    await updateExerciseTip(tipId, updatedTip);
    fetchTips();
  }, 500);

  const handleAddTip = async () => {
    if (newTip.trim()) {
      const newTipObj = await createExerciseTip(newTip);
      setTips([...tipsRef.current, newTipObj]);
      tipsRef.current = [...tipsRef.current, newTipObj];
      setNewTip("");
    }
  };

  const handleEditTip = (tipId, updatedTip) => {
    const updatedTips = tipsRef.current.map((tip) =>
      tip.id === tipId ? { ...tip, tip: updatedTip } : tip
    );
    setTips(updatedTips);
    tipsRef.current = updatedTips;
    debouncedUpdateTip(tipId, updatedTip);
  };

  const handleDeleteTip = async (tipId) => {
    await deleteExerciseTip(tipId);
    const updatedTips = tipsRef.current.filter((tip) => tip.id !== tipId);
    setTips(updatedTips);
    tipsRef.current = updatedTips;
  };

  const handleGetRecommendations = async () => {
    if (height && weight) {
      setLoading(true);
      setBmi(calculateBmi(height, weight));
      const data = await getExerciseRecommendations(height, weight);
      console.log("Recommendations Data:", data); // Log the response

      // Limit the recommendations to the top 5
      if (data.recommendedExercises) {
        setRecommendations(data.recommendedExercises.slice(0, 5));
      } else {
        console.error("No recommendations found in the response.");
      }
      setLoading(false);
    }
  };

  const handleGetHealthInfo = async () => {
    if (foodItem && exerciseQuery) {
      setLoadingHealthInfo(true);
      const data = await getHealthInfo(foodItem, exerciseQuery);
      setHealthInfo(data);
      console.log("Health Info Data:", data); // Log the response
      setLoadingHealthInfo(false);
    }
  };

  const calculateBmi = (height, weight) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters ** 2)).toFixed(1);
  };

  const sections = [
    { id: "tips", icon: FaListAlt, label: "Exercise Tips" },
    { id: "recommendations", icon: FaDumbbell, label: "Recommendations" },
    { id: "health", icon: FaInfoCircle, label: "Health Info" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Vertical Navigation */}
      <nav className="bg-orange-600 text-white p-4 md:w-64 md:min-h-screen">
        <h1 className="text-2xl font-bold mb-8 text-center">Health Hub</h1>
        <div className="flex md:flex-col gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 w-full p-3 rounded transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-white text-orange-600"
                  : "hover:bg-orange-500"
              }`}
            >
              <section.icon />
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
        {/* Tips Section */}
{activeSection === "tips" && (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Exercise Tips</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter a new exercise tip"
          value={newTip}
          onChange={(e) => setNewTip(e.target.value)}
          className="flex-1 p-2 border border-orange-200 rounded focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
        />
        <button
          onClick={handleAddTip}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all duration-300"
          >
            {editTipId === tip.id ? (
              <input
                type="text"
                defaultValue={tip.tip}
                onBlur={(e) => {
                  handleEditTip(tip.id, e.target.value);
                  setEditTipId(null);
                }}
                className="flex-1 p-2 border border-orange-200 rounded mr-2"
                autoFocus
              />
            ) : (
              <p className="flex-1">{tip.tip}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setEditTipId(tip.id)}
                className="text-blue-500 hover:text-blue-600 p-1"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteTip(tip.id)}
                className="text-red-500 hover:text-red-600 p-1"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

          {/* Recommendations Section */}
          {activeSection === "recommendations" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">Exercise Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  placeholder="Height (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="p-2 border border-orange-200 rounded focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="p-2 border border-orange-200 rounded focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>
              <button
                onClick={handleGetRecommendations}
                className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center"
                disabled={loading}
              >
                <FaRunning className="mr-2" /> {loading ? "Loading..." : "Get Recommendations"}
              </button>
              {bmi && (
                <div className="mt-4 text-center text-lg font-semibold text-orange-600">
                  BMI: {bmi}
                </div>
              )}
              <ul className="mt-4 space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="bg-gray-100 p-2 rounded">
                    {rec.name} {/* Adjust this property based on your API response structure */}
                  </li>
                ))}
              </ul>
            </div>
          )}

         {/* Health Info Section */}
{activeSection === "health" && (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-orange-600 mb-4">Health Info</h2>
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Food Item"
        value={foodItem}
        onChange={(e) => setFoodItem(e.target.value)}
        className="flex-1 p-2 border border-orange-200 rounded focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
      />
      <input
        type="text"
        placeholder="Exercise Query"
        value={exerciseQuery}
        onChange={(e) => setExerciseQuery(e.target.value)}
        className="flex-1 p-2 border border-orange-200 rounded focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
      />
    </div>
    <button
      onClick={handleGetHealthInfo}
      className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center"
      disabled={loadingHealthInfo}
    >
      {loadingHealthInfo ? "Loading..." : "Get Health Info"}
    </button>
    {healthInfo && (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Health Information:</h3>
        <ul className="list-disc pl-5 mt-2 bg-gray-100 p-4 rounded-lg">
          <li><strong>Calories:</strong> {healthInfo.caloriesGained || 'N/A'}</li>
          <li><strong>Protein:</strong> {healthInfo.totalProtein || 'N/A'} g</li>
          <li><strong>Carbohydrates:</strong> {healthInfo.totalCarbohydrates || 'N/A'} g</li>
          <li><strong>Fats:</strong> {healthInfo.totalFat || 'N/A'} g</li>
          <li><strong>Fiber:</strong> {healthInfo.totalFiber || 'N/A'} g</li>
        </ul>
      </div>
    )}
  </div>
)}
        </div>
      </main>
    </div>
  );
};

export default TipGenerator;
