import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import WellbeeLogo from "../../assets/images/colorlogo.svg"; // Replace with Wellbee logo
import signupImage from "../../assets/images/wellbee-signup1.svg"; // Replace with Wellbee illustration
import Navbar from "../../components/common/Navbar";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigateToLogin = () => {
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", {
        position: "bottom-right",
        autoClose: 1000,
        theme: "light",
        transition: Zoom,
      });
      return;
    }

    try {
      await toast.promise(
        axios.post(`${import.meta.env.VITE_APP_URL}users/signup`, {
          name: username,
          email,
          password,
        }),
        {
          pending: "Creating your account...",
          success: "User Created Successfully",
          error: {
            render({ data }) {
              setError(data?.response?.data?.error || "Internal Server Error");
              return data?.response?.data?.error || "Internal Server Error";
            },
          },
          position: "bottom-right",
          autoClose: 1000,
          theme: "light",
          transition: Zoom,
        }
      );
      navigateToLogin();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Internal Server Error", {
        position: "bottom-right",
        autoClose: 1000,
        theme: "light",
        transition: Zoom,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center mt-10 justify-center bg-orange-100">
        <div className="bg-white mt-20 shadow-lg rounded-lg overflow-hidden flex w-3/4 max-w-4xl">
          {/* Signup Image Section */}
          <div className="hidden md:block md:w-1/2 bg-orange-200 p-8">
            <img
              src={signupImage}
              alt="Signup Illustration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <div className="flex justify-center mb-4">
              <img src={WellbeeLogo} alt="Wellbee Logo" className="h-14 w-55" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">
              Sign Up to Wellbee
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-orange-500 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-orange-500 text-sm font-bold mb-2"
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
                  className="block text-orange-500 text-sm font-bold mb-2"
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

              <div className="mb-6">
                <label
                  className="block text-orange-500 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="text-red-500 text-xs italic">{error}</p>}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
