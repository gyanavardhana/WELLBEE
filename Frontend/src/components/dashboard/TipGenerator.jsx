import React, { useEffect, useState } from "react";
import {
  createExerciseTip,
  getExerciseTips,
  updateExerciseTip,
  deleteExerciseTip,
  getExerciseRecommendations,
} from "../../services/tipServices";

import { getHealthInfo } from "../../services/nutritionServices";

const TipGenerator = () => {
  const [tips, setTips] = useState([]);
  const [newTip, setNewTip] = useState("");
  const [editTipId, setEditTipId] = useState(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [foodItem, setFoodItem] = useState("");
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [healthInfo, setHealthInfo] = useState(null);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    const data = await getExerciseTips();
    setTips(data);
  };

  const handleAddTip = async () => {
    if (newTip.trim()) {
      await createExerciseTip(newTip);
      setNewTip("");
      fetchTips();
    }
  };

  const handleEditTip = async (tipId, updatedTip) => {
    await updateExerciseTip(tipId, updatedTip);
    fetchTips();
    setEditTipId(null);
  };

  const handleDeleteTip = async (tipId) => {
    await deleteExerciseTip(tipId);
    fetchTips();
  };

  const handleGetRecommendations = async () => {
    if (height && weight) {
      const data = await getExerciseRecommendations(height, weight);
      setRecommendations(data.recommendedExercises);
    }
  };

  const handleGetHealthInfo = async () => {
    if (foodItem && exerciseQuery) {
      const data = await getHealthInfo(foodItem, exerciseQuery);
      setHealthInfo(data);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-orange-600 mb-4">Exercise Tips</h2>

      {/* Add New Tip Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter a new exercise tip"
          value={newTip}
          onChange={(e) => setNewTip(e.target.value)}
          className="w-full p-2 border border-orange-400 rounded mb-2"
        />
        <button
          onClick={handleAddTip}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Add Tip
        </button>
      </div>

      {/* Tips List */}
      <div className="mb-6">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="flex items-center justify-between bg-orange-100 p-2 rounded mb-2"
          >
            {editTipId === tip.id ? (
              <input
                type="text"
                defaultValue={tip.tip}
                onBlur={(e) => handleEditTip(tip.id, e.target.value)}
                className="w-full p-1 border border-orange-400 rounded"
              />
            ) : (
              <p className="text-gray-800">{tip.tip}</p>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => setEditTipId(tip.id)}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTip(tip.id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations Form */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-orange-600 mb-2">Get Exercise Recommendations</h3>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full sm:w-1/2 p-2 border border-orange-400 rounded"
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full sm:w-1/2 p-2 border border-orange-400 rounded"
          />
        </div>
        <button
          onClick={handleGetRecommendations} // No parentheses here
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Get Recommendations
        </button>
      </div>

      {/* Recommendations List */}
      <div className="mt-4">
        {recommendations.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-orange-600 mb-2">Recommended Exercises</h3>
            <ul className="list-disc list-inside">
              {recommendations.map((exercise, index) => (
                <li key={index} className="text-gray-800">{exercise.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Health Information Form */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-orange-600 mb-2">Get Health Information</h3>
        <input
          type="text"
          placeholder="Enter a food item (e.g., apple)"
          value={foodItem}
          onChange={(e) => setFoodItem(e.target.value)}
          className="w-full p-2 border border-orange-400 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Enter an exercise query (e.g., running for 10 minutes)"
          value={exerciseQuery}
          onChange={(e) => setExerciseQuery(e.target.value)}
          className="w-full p-2 border border-orange-400 rounded mb-4"
        />
        <button
          onClick={handleGetHealthInfo}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Get Health Info
        </button>
      </div>

      {/* Health Information Display */}
      {healthInfo && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">Health Info Summary</h3>
          <p className="text-gray-800">Calories Gained: {healthInfo.caloriesGained}</p>
          <p className="text-gray-800">Carbohydrates: {healthInfo.totalCarbohydrates}g</p>
          <p className="text-gray-800">Protein: {healthInfo.totalProtein}g</p>
          <p className="text-gray-800">Fiber: {healthInfo.totalFiber}g</p>
          <p className="text-gray-800">Fat: {healthInfo.totalFat}g</p>
        </div>
      )}
    </div>
  );
};

export default TipGenerator;
