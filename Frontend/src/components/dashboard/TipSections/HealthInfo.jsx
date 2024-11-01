import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHealthInfo } from "../../../services/nutritionServices";
import { 
  FaAppleAlt, 
  FaDumbbell, 
  FaFire, 
  FaBreadSlice, 
  FaCube, 
  FaWeight 
} from "react-icons/fa";
import { toast } from "react-toastify";

const HealthInfo = () => {
    const [foodItem, setFoodItem] = useState("");
    const [exerciseQuery, setExerciseQuery] = useState("");
    const [healthInfo, setHealthInfo] = useState(null);
    const [loadingHealthInfo, setLoadingHealthInfo] = useState(false);
    const [error, setError] = useState(null);
  
    const handleGetHealthInfo = async () => {
      if (foodItem && exerciseQuery) {
        try {
          setLoadingHealthInfo(true);
          setError(null);
          const data = await getHealthInfo(foodItem, exerciseQuery);
          setHealthInfo(data);
          toast.success("Health information fetched successfully!");
        } catch (err) {
          console.error("Failed to fetch health info", err);
          setError("Failed to retrieve health information. Please try again.");
          setHealthInfo(null);
          toast.error("Error retrieving health information.");
        } finally {
          setLoadingHealthInfo(false);
        }
      }
    };
  
    const NutrientIcon = ({ icon: Icon, color }) => (
      <Icon className={`mr-2 ${color}`} />
    );
  
    const NutrientDisplay = ({ icon: Icon, color, label, value, unit }) => (
      <div className="flex items-center bg-orange-50 p-3 rounded-lg mb-2">
        <NutrientIcon icon={Icon} color={color} />
        <div>
          <span className="font-semibold text-gray-700">{label}: </span>
          <span className="text-orange-600">{value} {unit}</span>
        </div>
      </div>
    );
  
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg overflow-y-auto h-full">
        <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center flex items-center justify-center">
          <FaAppleAlt className="mr-3 text-orange-500" />
          Health Information
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Item</label>
            <input
              type="text"
              placeholder="Enter food item"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGetHealthInfo()}
              className="w-full p-2 border border-orange-200 rounded focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
            <input
              type="text"
              placeholder="Enter exercise"
              value={exerciseQuery}
              onChange={(e) => setExerciseQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGetHealthInfo()}
              className="w-full p-2 border border-orange-200 rounded focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
            />
          </div>
        </div>
        
        <button
          onClick={handleGetHealthInfo}
          disabled={loadingHealthInfo || !foodItem || !exerciseQuery}
          className={`w-full py-3 rounded transition-all duration-300 flex items-center justify-center 
            ${(!foodItem || !exerciseQuery) 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
        >
          <FaDumbbell className="mr-2" />
          {loadingHealthInfo ? "Calculating..." : "Get Health Info"}
        </button>
        
        {loadingHealthInfo && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mt-4 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {healthInfo && !loadingHealthInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <h3 className="text-lg font-semibold text-orange-600 mb-3 text-center">
                Nutrition & Exercise Breakdown
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <NutrientDisplay 
                  icon={FaFire}
                  color="text-red-500"
                  label="Calories Gained"
                  value={healthInfo.caloriesGained}
                  unit="kcal"
                />
                <NutrientDisplay 
                  icon={FaBreadSlice}
                  color="text-yellow-600"
                  label="Carbohydrates"
                  value={healthInfo.totalCarbohydrates}
                  unit="g"
                />
                <NutrientDisplay 
                  icon={FaCube}
                  color="text-green-500"
                  label="Protein"
                  value={healthInfo.totalProtein}
                  unit="g"
                />
                <NutrientDisplay 
                  icon={FaWeight}
                  color="text-blue-500"
                  label="Fiber"
                  value={healthInfo.totalFiber}
                  unit="g"
                />
              </div>
              <div className="mt-3 text-center text-sm text-gray-500">
                Nutrition information for {foodItem} with {exerciseQuery}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
};

export default HealthInfo;
