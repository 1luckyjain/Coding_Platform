// src/components/Header.jsx
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
const Header = ({ loggedinUser = "Guest", handleSignout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // cleanup
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Left Side - Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-xl text-xl font-bold shadow-lg transform hover:scale-105 transition-transform duration-200">
              &lt;/&gt;
            </span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EduCode
            </span>
            <p className="text-xs text-gray-500 font-medium">
              Coding Excellence Platform
            </p>
          </div>
        </div>

        {/* Center - Navigation */}
        <div className="hidden lg:flex gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-indigo-600 font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm hover:shadow-md"
                  : "text-gray-700 hover:text-indigo-600 font-medium hover:bg-white/50"
              }`
            }
          >
            <span className="text-lg">📊</span> Dashboard
          </NavLink>
          <NavLink
            to="/contests"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-indigo-600 font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm hover:shadow-md"
                  : "text-gray-700 hover:text-indigo-600 font-medium hover:bg-white/50"
              }`
            }
          >
            <span className="text-lg">🏆</span> Contests
          </NavLink>
          <NavLink
            to="/problems"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-indigo-600 font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm hover:shadow-md"
                  : "text-gray-700 hover:text-indigo-600 font-medium hover:bg-white/50"
              }`
            }
          >
            <span className="text-lg">📊</span> Problems
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-indigo-600 font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm hover:shadow-md"
                  : "text-gray-700 hover:text-indigo-600 font-medium hover:bg-white/50"
              }`
            }
          >
            <span className="text-lg">📊</span> Analytics
          </NavLink>
        </div>

        {/* Right Side - User Info */}
        <div className="flex items-center gap-4">
          {/* Time */}
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-700">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs text-gray-500">
              {currentTime.toLocaleDateString()}
            </p>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-white to-gray-50 px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="relative">
              <span className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-bold text-lg shadow-md">
                {loggedinUser.charAt(0).toUpperCase()}
              </span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-gray-800">{loggedinUser}</p>
              <p className="text-xs text-indigo-600 font-medium">
                Faculty • Online
              </p>
            </div>
          </div>

          {/* Settings */}
          <button className="p-3 rounded-xl hover:bg-white/50 transition-all duration-200 group">
            <span className="text-xl group-hover:rotate-90 transition-transform duration-200">
              ⚙️
            </span>
          </button>

          {/* Signout */}
          <button
            onClick={handleSignout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
