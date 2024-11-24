import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import animation from "../../assets/images/logo.svg";
import coachingImage from "../../assets/images/personalcoaching.svg";
import chatImage from "../../assets/images/groupchat.svg";
import moodMeterImage from "../../assets/images/moodmeter.svg";
import therapyImage from "../../assets/images/therapy.svg";
import VultrChatbot from "../../components/common/VultrChatbot";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-orange-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Add padding to account for the fixed Navbar */}
      <div className="pt-16 md:pt-20"> {/* Adjust these values based on your Navbar height */}
        <img
          src={animation}
          alt="Wellbee Animation"
          className="w-full max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-5rem)] object-contain"
        />
      </div>

      <div className="flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <div className="w-full max-w-7xl shadow-lg rounded-lg bg-orange-100 py-16 md:py-28 px-4 flex flex-col items-center text-center mt-8">
          <h1 className="text-3xl md:text-5xl font-bold text-orange-800">
            Welcome to Wellbee
          </h1>
          <p className="mt-4 text-lg text-orange-700">
            Your holistic platform for physical and mental well-being.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-200 text-orange-800 px-6 py-2 rounded-lg hover:bg-orange-300 transition duration-300"
            >
              Log In
            </button>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 w-full max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-orange-800 text-center mb-12">
            Our Features
          </h2>
          <div className="space-y-12">
            {[
              {
                title: "Personalized Coaching",
                desc: "Get custom exercise and diet plans based on your body metrics.",
                image: coachingImage,
                imageAlt: "Personalized Coaching",
              },
              {
                title: "Anonymous Group Chat",
                desc: "Discuss mental health issues openly, backed by sentiment analysis.",
                image: chatImage,
                imageAlt: "Anonymous Group Chat",
              },
              {
                title: "Mood Meter",
                desc: "Curated music that aligns with your current emotional state.",
                image: moodMeterImage,
                imageAlt: "Mood Meter",
              },
              {
                title: "Therapy Consultations",
                desc: "Easy access to expert guidance when you need professional help.",
                image: therapyImage,
                imageAlt: "Therapy Consultations",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-orange-100 p-8 shadow-lg rounded-lg flex flex-col md:flex-row h-auto md:h-80"
              >
                <div
                  className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? "md:order-first" : "md:order-last"
                  }`}
                >
                  <img
                    src={feature.image}
                    alt={feature.imageAlt}
                    className="w-full h-48 md:h-64 object-contain rounded-lg mb-6 md:mb-0"
                  />
                </div>
                <div
                  className={`w-full md:w-1/2 flex flex-col justify-center ${
                    index % 2 === 0 ? "md:pl-8" : "md:pr-8"
                  }`}
                >
                  <h3 className="text-2xl font-semibold text-orange-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-orange-700">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full bg-orange-200 py-12 px-4">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-orange-800">
              Ready to start your wellness journey?
            </h3>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-orange-100 text-orange-800 px-6 py-2 rounded-lg hover:bg-orange-300 transition duration-300"
              >
                Log In
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-orange-800 text-orange-100 py-8 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p>© 2024 Wellbee. All Rights Reserved.</p>
            <div className="mt-4">
              <button
                onClick={() => navigate("/terms")}
                className="text-orange-200 hover:text-white mx-2"
              >
                Terms
              </button>
              <button
                onClick={() => navigate("/privacy")}
                className="text-orange-200 hover:text-white mx-2"
              >
                Privacy
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="text-orange-200 hover:text-white mx-2"
              >
                Contact
              </button>
            </div>
          </div>
        </footer>
      </div>
      <VultrChatbot />
    </div>
  );
};

export default Home;
