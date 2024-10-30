import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import WellbeeLogo from "../../assets/images/colorlogo.svg";
import loginImage from "../../assets/images/wellbee-login.svg";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../services/userServices";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.2 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.3 },
  },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  // Memoized handlers to prevent re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const navigateToHome = useCallback(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const { email, password } = formData;

    if (!email || !password) {
        toast.error("Email and password are required.");
        return;
    }

    setIsLoading(true);

    try {
        await toast.promise(login({ email, password }), {
            pending: {
                render: "Logging in...",
                icon: "🔄",
            },
            success: {
                render: () => {
                    navigateToHome();
                    return "Login Successful! 🎉";
                },
            },
            error: {
                render: ({ data }) => {
                    // Use toast to display the error message
                    toast.error(data || "Internal Server Error");
                    return `Error: ${data.message || "Internal Server Error"} 😕`;
                },
            },
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Zoom,
        });
    } catch (err) {
        console.error("Login error:", err);
        toast.error("An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
};


  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen flex items-center justify-center bg-orange-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="bg-white mt-20 shadow-lg rounded-lg overflow-hidden flex w-3/4 max-w-4xl"
          whileHover={{ boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
        >
          {/* Form Section */}
          <motion.div className="w-full md:w-1/2 p-8" variants={formVariants}>
            <motion.div
              className="flex justify-center mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src={WellbeeLogo} alt="Wellbee Logo" className="h-14 w-55" />
            </motion.div>

            <motion.h2
              className="text-2xl font-bold mb-6 text-center text-orange-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Login to Wellbee
            </motion.h2>

            <form onSubmit={handleSubmit}>
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
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
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div
                className="mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
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
                  disabled={isLoading}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    key="error"
                    className="text-red-500 text-xs italic mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  type="submit"
                  className={`bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          {/* Login Image Section */}
          <motion.div
            className="hidden md:block md:w-1/2 bg-orange-200 p-8"
            variants={imageVariants}
          >
            <motion.img
              src={loginImage}
              alt="Login Illustration"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
