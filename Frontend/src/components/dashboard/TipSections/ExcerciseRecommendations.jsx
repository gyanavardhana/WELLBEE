import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getExerciseRecommendations } from "../../../services/tipServices";
import { FaRunning, FaCalculator, FaHeartbeat } from "react-icons/fa";
import { toast } from "react-toastify";

const ExerciseRecommendations = () => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bmiCategory, setBmiCategory] = useState("");
  
    const calculateBmi = (height, weight) => {
      const heightInMeters = height / 100;
      const calculatedBmi = (weight / (heightInMeters ** 2)).toFixed(1);
      
      let category = "";
      if (calculatedBmi < 18.5) category = "Underweight";
      else if (calculatedBmi >= 18.5 && calculatedBmi < 24.9) category = "Normal weight";
      else if (calculatedBmi >= 25 && calculatedBmi < 29.9) category = "Overweight";
      else category = "Obese";
      
      setBmiCategory(category);
      return calculatedBmi;
    };
  
    const handleGetRecommendations = async () => {
      if (height && weight) {
        try {
          setLoading(true);
          const calculatedBmi = calculateBmi(height, weight);
          setBmi(calculatedBmi);
          
          const data = await getExerciseRecommendations(height, weight);
          setRecommendations(data.recommendedExercises?.slice(0, 5) || []);
          toast.success("Exercise recommendations fetched successfully!");
        } catch (error) {
          toast.error("Failed to get exercise recommendations");
          setRecommendations([]);
        } finally {
          setLoading(false);
        }
      }
    };
  
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg overflow-y-auto h-full">
        <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center flex items-center justify-center">
          <FaRunning className="mr-3 text-orange-500" />
          Exercise Recommendations
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <input
              type="number"
              placeholder="Enter height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGetRecommendations()}
              min="50"
              max="250"
              className="w-full p-2 border border-orange-200 rounded focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGetRecommendations()}
              min="20"
              max="300"
              className="w-full p-2 border border-orange-200 rounded focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
            />
          </div>
        </div>
        
        <button
          onClick={handleGetRecommendations}
          disabled={loading || !height || !weight}
          className={`w-full py-3 rounded transition-all duration-300 flex items-center justify-center 
            ${(!height || !weight) 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
        >
          <FaCalculator className="mr-2" />
          {loading ? "Calculating..." : "Get Recommendations"}
        </button>
        
        <AnimatePresence>
          {bmi && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              <div className="flex justify-center items-center gap-2 text-lg font-semibold">
                <FaHeartbeat className="text-orange-500" />
                <span>BMI: {bmi} ({bmiCategory})</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <AnimatePresence>
              {recommendations.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-lg font-semibold text-orange-600 mb-2 text-center">
                    Recommended Exercises
                  </h3>
                  <ul className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-orange-50 p-3 rounded-lg flex items-center gap-2 hover:bg-orange-100 transition-colors"
                      >
                        <FaRunning className="text-orange-500" />
                        {rec.name}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ) : (bmi && (
                <div className="text-center text-gray-500 py-4">
                  No recommendations available. Try adjusting your inputs.
                </div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    );
};

export default ExerciseRecommendations;
