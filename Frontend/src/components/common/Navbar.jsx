import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { Menu, X } from 'lucide-react';
import Logo1 from "../../assets/images/colorlogo.svg";
import Logo2 from "../../assets/images/colortext.svg";
import { isTokenExpired } from "../../utils/authUtils";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState({ login: false, profile: false });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("authToken");
    setIsLoggedIn(token && !isTokenExpired(token));
  }, []);

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu((prev) => ({ ...prev, [menu]: true }));
  };

  const handleMouseLeave = (menu) => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu((prev) => ({ ...prev, [menu]: false }));
    }, 100);
  };

  const handleOptionClick = (path) => {
    const token = Cookies.get("authToken");
    if (!token || isTokenExpired(token)) {
      toast.error("Session timed out", {
        position: "bottom-right",
        autoClose: 1000,
        transition: Zoom,
      });
      navigate("/login");
      return;
    }
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    setIsLoggedIn(false);
    toast.success("Logged out successfully", {
      position: "bottom-right",
      autoClose: 1000,
      transition: Zoom,
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-orange-100 p-4 flex justify-between items-center shadow-md w-full fixed top-0 border-b border-orange-300 z-50">
        <div className="flex items-center space-x-4 h-16">
          <img
            src={Logo1}
            alt="Logo 1"
            className="h-12 w-auto cursor-pointer object-contain"
            onClick={() => navigate("/")}
          />
          <img
            src={Logo2}
            alt="Logo 2"
            className="h-20 w-auto cursor-pointer object-contain "
            onClick={() => navigate("/")}
          />
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-orange-800 hover:bg-orange-200 p-2 rounded transition duration-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <NavItem onClick={() => handleOptionClick("/moodmeter")} text="Mood Meter" />
          <NavItem onClick={() => handleOptionClick("/therapy")} text="Therapy" />
          <NavItem onClick={() => handleOptionClick("/chat")} text="Chat" />
          <NavItem onClick={() => handleOptionClick("/dashboard")} text="Dashboard" />

          {isLoggedIn ? (
            <ProfileMenu
              handleMouseEnter={() => handleMouseEnter("profile")}
              handleMouseLeave={() => handleMouseLeave("profile")}
              isOpen={openMenu.profile}
              handleDashboardClick={() => handleOptionClick("/dashboard")}
              handleLogout={handleLogout}
            />
          ) : (
            <LoginMenu
              handleMouseEnter={() => handleMouseEnter("login")}
              handleMouseLeave={() => handleMouseLeave("login")}
              isOpen={openMenu.login}
              navigate={navigate}
            />
          )}
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-orange-100 pt-20">
          <div className="flex flex-col items-center space-y-4 p-4">
            <NavItem onClick={() => handleOptionClick("/moodmeter")} text="Mood Meter" />
            <NavItem onClick={() => handleOptionClick("/therapy")} text="Therapy" />
            <NavItem onClick={() => handleOptionClick("/chat")} text="Chat" />
            <NavItem onClick={() => handleOptionClick("/dashboard")} text="Dashboard" />
            {isLoggedIn ? (
              <>
                <NavItem onClick={() => handleOptionClick("/dashboard")} text="Dashboard" />
                <NavItem onClick={handleLogout} text="Logout" />
              </>
            ) : (
              <>
                <NavItem onClick={() => navigate("/signup")} text="Signup" />
                <NavItem onClick={() => navigate("/login")} text="Login" />
              </>
            )}
          </div>
        </div>
      )}
    <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
    </>
  );
}

const NavItem = ({ onClick, text }) => (
  <button
    className="text-orange-800 text-xl hover:bg-orange-200 px-4 py-2 rounded transition duration-300 w-full md:w-auto"
    onClick={onClick}
  >
    {text}
  </button>
);

const ProfileMenu = ({ handleMouseEnter, handleMouseLeave, isOpen, handleDashboardClick, handleLogout }) => (
  <div
    className="relative"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <button className="text-orange-800 text-xl hover:bg-orange-200 px-4 py-2 rounded transition duration-300">
      Profile
    </button>
    {isOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-orange-100 border rounded shadow-lg border-orange-300">
        <div
          onClick={handleDashboardClick}
          className="px-4 py-2 text-orange-800 hover:bg-orange-200 cursor-pointer transition duration-300"
        >
          Dashboard
        </div>
        <div
          onClick={handleLogout}
          className="px-4 py-2 text-orange-800 hover:bg-orange-200 cursor-pointer transition duration-300"
        >
          Logout
        </div>
      </div>
    )}
  </div>
);

const LoginMenu = ({ handleMouseEnter, handleMouseLeave, isOpen, navigate }) => (
  <div
    className="relative"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <button className="text-orange-800 text-xl hover:bg-orange-200 px-4 py-2 rounded transition duration-300">
      Login
    </button>
    {isOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-orange-100 border rounded shadow-lg border-orange-300">
        <div
          onClick={() => navigate("/signup")}
          className="px-4 py-2 text-orange-800 hover:bg-orange-200 cursor-pointer transition duration-300"
        >
          Signup
        </div>
        <div
          onClick={() => navigate("/login")}
          className="px-4 py-2 text-orange-800 hover:bg-orange-200 cursor-pointer transition duration-300"
        >
          Login
        </div>
      </div>
    )}
  </div>
);

