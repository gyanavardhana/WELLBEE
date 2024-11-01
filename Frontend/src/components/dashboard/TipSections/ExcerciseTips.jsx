import React, { useState, useEffect } from "react";
import { createExerciseTip, getExerciseTips, updateExerciseTip, deleteExerciseTip } from "../../../services/tipServices";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const ExerciseTips = () => {
    const [tips, setTips] = useState([]);
    const [newTip, setNewTip] = useState("");
    const [editTipId, setEditTipId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      fetchTips();
    }, [tips.length]);
  
    const fetchTips = async () => {
      setIsLoading(true);
      try {
        const data = await getExerciseTips();
        setTips(data);
      } catch (error) {
        toast.error("Failed to fetch tips");
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleAddTip = async () => {
      if (newTip.trim()) {
        try {
          const newTipObj = await createExerciseTip(newTip);
          setTips((prevTips) => [...prevTips, newTipObj]);
          setNewTip("");
          toast.success("Tip added successfully!");
        } catch (error) {
          toast.error("Failed to add tip");
        }
      }
    };
  
    const handleEditTip = async (tipId, updatedTip) => {
      try {
        await updateExerciseTip(tipId, updatedTip);
        setTips((prevTips) =>
          prevTips.map((tip) =>
            tip.id === tipId ? { ...tip, tip: updatedTip } : tip
          )
        );
        setEditTipId(null);
        toast.success("Tip updated successfully!");
      } catch (error) {
        toast.error("Failed to update tip");
      }
    };
  
    const handleDeleteTip = async (tipId) => {
      try {
        await deleteExerciseTip(tipId);
        setTips((prevTips) => prevTips.filter((tip) => tip.id !== tipId));
        toast.success("Tip deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete tip");
      }
    };
  
    return (
      <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg overflow-y-auto h-full">
        <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">Exercise Tips</h2>
        
        {/* Add Tip Section */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter a new exercise tip"
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTip()}
            className="flex-1 p-2 border border-orange-200 rounded focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none"
          />
          <button
            onClick={handleAddTip}
            className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </div>
        
        {/* Tips List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <AnimatePresence>
            {tips.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No exercise tips yet. Add your first tip!
              </div>
            ) : (
              <div className="space-y-2">
                {tips.map((tip) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    {editTipId === tip.id ? (
                      <input
                        type="text"
                        defaultValue={tip.tip}
                        onBlur={(e) => handleEditTip(tip.id, e.target.value)}
                        className="flex-1 p-2 border border-orange-200 rounded mr-2"
                        autoFocus
                      />
                    ) : (
                      <p className="flex-1 text-gray-700">{tip.tip}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditTipId(tip.id)}
                        className="text-blue-500 hover:text-blue-600 p-1 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteTip(tip.id)}
                        className="text-red-500 hover:text-red-600 p-1 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
};

export default ExerciseTips;
