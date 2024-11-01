import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
import MetricsWatcher from "../../components/dashboard/MetricWatcher";
import Generator from "../../components/dashboard/Generator";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("tips");

  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-screen bg-orange-100 mt-24">
        {/* Sidebar for larger screens, horizontal nav for small screens */}
        <div className="lg:w-1/5 bg-orange-200 p-6 lg:p-8 flex lg:flex-col flex-row justify-around lg:justify-start">
          <nav className="space-y-4 lg:space-y-4 flex lg:flex-col flex-row space-x-4 lg:space-x-0 w-full">
            <button
              onClick={() => setActiveTab("tips")}
              className={`flex items-center text-lg lg:text-xl p-2 lg:p-3 w-full lg:w-auto rounded-md transition duration-300 ${
                activeTab === "tips"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-200 hover:bg-orange-300"
              }`}
            >
              Tips
            </button>
            
          
            
            <button
              onClick={() => setActiveTab("metrics")}
              className={`flex items-center text-lg lg:text-xl p-2 lg:p-3 w-full lg:w-auto rounded-md transition duration-300 ${
                activeTab === "metrics"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-200 hover:bg-orange-300"
              }`}
            >
              Metrics Watcher
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-4/5 bg-orange-100 p-6 lg:p-8">
          {activeTab === "tips" && <Generator />}
          {activeTab === "metrics" && <MetricsWatcher />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
