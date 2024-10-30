import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import { motion } from "framer-motion";
import WellbeeLogo from "../../assets/images/colorlogo.svg";
import signupImage from "../../assets/images/wellbee-signup1.svg";
import Navbar from "../../components/common/Navbar";
import { signup } from "../../services/userServices";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER", // Default role
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
    const { username, email, password, confirmPassword, role } = formData;

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
        signup({ name: username, email, password, role }), // Include role
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center mt-10 justify-center bg-orange-100">
        <motion.div
          className="bg-white mt-20 shadow-lg rounded-lg overflow-hidden flex w-3/4 max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Signup Image Section */}
          <motion.div
            className="hidden md:block md:w-1/2 bg-orange-200 p-8"
            variants={imageVariants}
          >
            <img
              src={signupImage}
              alt="Signup Illustration"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <motion.div
              className="flex justify-center mb-4"
              variants={itemVariants}
            >
              <img src={WellbeeLogo} alt="Wellbee Logo" className="h-14 w-55" />
            </motion.div>

            <motion.h2
              className="text-2xl font-bold mb-6 text-center text-orange-500"
              variants={itemVariants}
            >
              Sign Up to Wellbee
            </motion.h2>

            <form onSubmit={handleSubmit}>
              <motion.div className="mb-4" variants={itemVariants}>
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
              </motion.div>

              <motion.div className="mb-4" variants={itemVariants}>
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
              </motion.div>

              <motion.div className="mb-4" variants={itemVariants}>
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
              </motion.div>

              <motion.div className="mb-6" variants={itemVariants}>
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
              </motion.div>

              {/* Role Selection Dropdown */}
              <motion.div className="mb-4" variants={itemVariants}>
                <label
                  className="block text-orange-500 text-sm font-bold mb-2"
                  htmlFor="role"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="USER">User</option>
                  <option value="THERAPIST">Therapist</option>
                </select>
              </motion.div>

              {error && (
                <motion.p
                  className="text-red-500 text-xs italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <motion.button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
