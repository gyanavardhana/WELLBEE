import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import WellbeeLogo from "../../assets/images/colorlogo.svg"; // Replace with Wellbee logo
import loginImage from "../../assets/images/wellbee-login.svg"; // Replace with Wellbee illustration
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Navigate to home page after successful login
  const navigateToHome = () => {
    setTimeout(() => {
      navigate("/"); // Navigate to home page after delay
    }, 1500); // Delay to match Toastify autoClose duration
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    toast.promise(
      axios.post(`${import.meta.env.VITE_APP_URL}user/login`, { email, password })
        .then(response => {
          Cookies.set("authToken", response.data.token, { expires: 7 }); // Set the cookie for 7 days
          return response; // Return response to handle success
        }),
      {
        pending: "Logging in...",
        success: {
          render({ data }) {
            navigateToHome(); // Call the navigation function after success toast
            return "Login Successful";
          }
        },
        error: {
          render({ data }) {
            setError(data?.response?.data?.error || "Internal Server Error");
            return data?.response?.data?.error || "Internal Server Error";
          }
        },
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Zoom,
      }
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-orange-100">
        <div className="bg-white mt-20 shadow-lg rounded-lg overflow-hidden flex w-3/4 max-w-4xl">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <div className="flex justify-center mb-4">
              <img src={WellbeeLogo} alt="Wellbee Logo" className="h-14 w-55" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center text-orange-400">
              Login to Wellbee
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-orange-400 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-orange-400 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
          {/* Login Image Section */}
          <div className="hidden md:block md:w-1/2 bg-orange-200 p-8">
            <img
              src={loginImage}
              alt="Login Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
