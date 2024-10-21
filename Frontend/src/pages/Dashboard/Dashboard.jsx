import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
const Dashboard = () => {
  const [formData, setFormData] = useState({ height: "", weight: "" });
  const [recommendations, setRecommendations] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock personalized recommendations (this would usually come from a backend API)
    const mockRecommendations = {
      exercise: "30 minutes of jogging daily",
      diet: "Increase protein intake and reduce sugar",
    };

    setRecommendations(mockRecommendations);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-24 flex bg-orange-100">
        {/* Main dashboard content */}
        <div className="w-full p-8">
          <h1 className="text-2xl font-bold text-orange-600 mb-6">
            Personalized Coaching Dashboard
          </h1>

          {/* Form Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="height"
                >
                  Height (in cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-orange-300 rounded focus:outline-none focus:border-orange-500"
                  placeholder="Enter your height"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="weight"
                >
                  Weight (in kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-orange-300 rounded focus:outline-none focus:border-orange-500"
                  placeholder="Enter your weight"
                />
              </div>

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
              >
                Get Recommendations
              </button>
            </form>
          </div>

          {/* Recommendations Section */}
          {recommendations && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-orange-600 mb-4">
                Your Personalized Recommendations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-200 rounded">
                  <h3 className="text-lg font-bold mb-2">Exercise</h3>
                  <p>{recommendations.exercise}</p>
                </div>
                <div className="p-4 bg-orange-200 rounded">
                  <h3 className="text-lg font-bold mb-2">Diet</h3>
                  <p>{recommendations.diet}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
