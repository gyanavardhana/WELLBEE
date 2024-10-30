import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Cookies from "js-cookie";
import UserProfile from "../../components/profile/userProfile";
import HealthMetrics from "../../components/profile/healthmetrics";
import TherapistProfile from "../../components/profile/therapistProfile";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const roleFromCookie = Cookies.get("role");
    if (roleFromCookie) {
      setRole(roleFromCookie);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-screen bg-orange-100 mt-24">
        {/* Sidebar for larger screens, horizontal nav for small screens */}
        <div className="lg:w-1/5 bg-orange-200 p-6 lg:p-8 flex lg:flex-col flex-row justify-around lg:justify-start">
          <nav className="space-y-4 lg:space-y-4 flex lg:flex-col flex-row space-x-4 lg:space-x-0 w-full">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center text-lg lg:text-xl p-2 lg:p-3 w-full lg:w-auto rounded-md transition duration-300 ${
                activeTab === "profile"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-200 hover:bg-orange-300"
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User Profile
            </button>
            <button
              onClick={() => setActiveTab("health")}
              className={`flex items-center text-lg lg:text-xl p-2 lg:p-3 w-full lg:w-auto rounded-md transition duration-300 ${
                activeTab === "health"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-200 hover:bg-orange-300"
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Health Metrics
            </button>
            {role === "THERAPIST" && (
              <button
                onClick={() => setActiveTab("therapist")}
                className={`flex items-center text-lg lg:text-xl p-2 lg:p-3 w-full lg:w-auto rounded-md transition duration-300 ${
                  activeTab === "therapist"
                    ? "bg-orange-600 text-white"
                    : "bg-orange-200 hover:bg-orange-300"
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Therapist Profile
              </button>
            )}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-4/5 bg-orange-100 p-6 lg:p-8">
          {activeTab === "profile" && <UserProfile />}
          {activeTab === "health" && <HealthMetrics />}
          {activeTab === "therapist" && role === "THERAPIST" && <TherapistProfile />}
        </div>
      </div>
    </>
  );
};

export default Profile;
