import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRunning, FaCalculator, FaHeartbeat, FaDumbbell, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { getExerciseRecommendations } from "../../../services/tipServices";

const ExercisePopup = ({ exercise, onClose }) => {
  if (!exercise) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <button
            className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-gray-800 transition-colors duration-300"
            onClick={onClose}
          >
            <FaTimes />
          </button>
          
          <div className="flex flex-col gap-6">
            <div className="aspect-video w-full bg-orange-50 rounded-lg overflow-hidden">
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-orange-600 capitalize">
                {exercise.name}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-600 mb-2">Target</h3>
                  <p className="capitalize">{exercise.target}</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-600 mb-2">Equipment</h3>
                  <p className="capitalize">{exercise.equipment}</p>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-600 mb-2">Secondary Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.secondaryMuscles.map((muscle, index) => (
                    <span
                      key={index}
                      className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full capitalize"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-600 mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700">{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ExerciseRecommendations = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bmiCategory, setBmiCategory] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);

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
                  {recommendations.map((exercise, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-orange-50 p-3 rounded-lg flex items-center gap-2 hover:bg-orange-100 transition-colors cursor-pointer"
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      <FaDumbbell className="text-orange-500" />
                      <span className="flex-1 capitalize">{exercise.name}</span>
                      <span className="text-orange-500">View Details →</span>
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

      <AnimatePresence>
        {selectedExercise && (
          <ExercisePopup
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExerciseRecommendations;