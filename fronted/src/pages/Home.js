import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Check for authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("loggedinUser");
    if (!token || !user) {
      navigate("/login");
    } else {
      // Simulate loading time for smooth transition
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [navigate]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // User info from localStorage
  const loggedinUser = localStorage.getItem("loggedinUser") || "User";

  // Example stats (replace with real data)
  const activeContests = 1;
  const activeContestsDelta = 2;
  const totalParticipants = 1247;
  const participantsGrowth = 18;
  const problemBank = 342;
  const avgPerformance = 78;

  // Handle Signout
  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedinUser");
    navigate("/login");
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Navbar with Glass Effect */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-6 py-4 sticky top-0 z-50">
        {/* Left Side - Enhanced Logo */}
        <div className="flex justify-between items-center">
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
              <p className="text-xs text-gray-500 font-medium">Coding Excellence Platform</p>
            </div>
          </div>

          {/* Center - Enhanced Navigation Links */}
          <div className="hidden lg:flex gap-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-indigo-600 font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-xl border border-indigo-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <span className="text-lg">📊</span> Dashboard
            </Link>
            <Link
              to="/contests"
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium px-4 py-2 rounded-xl hover:bg-white/50 transition-all duration-200"
            >
              <span className="text-lg">🏆</span> Contests
            </Link>
            <Link
              to="/problems"
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium px-4 py-2 rounded-xl hover:bg-white/50 transition-all duration-200"
            >
              <span className="text-lg">📘</span> Problems
            </Link>
            <Link
              to="/analytics"
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium px-4 py-2 rounded-xl hover:bg-white/50 transition-all duration-200"
            >
              <span className="text-lg">📈</span> Analytics
            </Link>
          </div>

          {/* Right Side - Enhanced User Info */}
          <div className="flex items-center gap-4">
            {/* Time Display */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-700">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-gray-500">
                {currentTime.toLocaleDateString()}
              </p>
            </div>

            {/* Enhanced User Profile */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-white to-gray-50 px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="relative">
                <span className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-bold text-lg shadow-md">
                  {loggedinUser.charAt(0).toUpperCase()}
                </span>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-gray-800">
                  {loggedinUser}
                </p>
                <p className="text-xs text-indigo-600 font-medium">Faculty • Online</p>
              </div>
            </div>

            {/* Enhanced Settings Icon */}
            <button className="p-3 rounded-xl hover:bg-white/50 transition-all duration-200 group">
              <span className="text-xl group-hover:rotate-90 transition-transform duration-200">⚙️</span>
            </button>

            {/* Enhanced Signout Button */}
            <button
              onClick={handleSignout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Main Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Enhanced Welcome Section */}
        <div className="mb-10 text-center">
          <div className="inline-block mb-4">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              {getGreeting()}, {loggedinUser}! 👋
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Ready to dive into today's coding challenges? Your dashboard is loaded with exciting updates! 🚀
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/contests"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <span>🏆</span> Join Contest
            </Link>
            <Link
              to="/problems"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <span>💡</span> Solve Problems
            </Link>
            <Link
              to="/analytics"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <span>📊</span> View Analytics
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Active Contests - Enhanced */}
          <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-lg hover:shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 border border-blue-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-2xl text-2xl shadow-lg">
                  📊
                </span>
                <div className="text-right">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Active Contests</h3>
              <div className="text-4xl font-black text-blue-600 mb-2">{activeContests}</div>
              <div className="flex items-center text-green-600 font-semibold">
                <span className="mr-1">↗️</span>
                +{activeContestsDelta} this week
              </div>
            </div>
          </div>

          {/* Participants - Enhanced */}
          <div className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-lg hover:shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 border border-green-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl text-2xl shadow-lg">
                  👥
                </span>
                <div className="text-right">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Total Participants</h3>
              <div className="text-4xl font-black text-green-600 mb-2">
                {totalParticipants.toLocaleString()}
              </div>
              <div className="flex items-center text-green-600 font-semibold">
                <span className="mr-1">📈</span>
                +{participantsGrowth}% this month
              </div>
            </div>
          </div>

          {/* Problem Bank - Enhanced */}
          <div className="group bg-gradient-to-br from-purple-50 to-violet-100 rounded-3xl shadow-lg hover:shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 border border-purple-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-gradient-to-r from-purple-500 to-violet-500 p-4 rounded-2xl text-2xl shadow-lg">
                  📘
                </span>
                <div className="text-right">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Problem Bank</h3>
              <div className="text-4xl font-black text-purple-600 mb-2">{problemBank}</div>
              <div className="flex items-center text-purple-600 font-semibold">
                <span className="mr-1">🔥</span>
                Ready to solve
              </div>
            </div>
          </div>

          {/* Performance - Enhanced */}
          <div className="group bg-gradient-to-br from-orange-50 to-amber-100 rounded-3xl shadow-lg hover:shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 border border-orange-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-2xl text-2xl shadow-lg">
                  ⚡
                </span>
                <div className="text-right">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Avg. Performance</h3>
              <div className="text-4xl font-black text-orange-600 mb-2">{avgPerformance}%</div>
              <div className="flex items-center text-orange-600 font-semibold">
                <span className="mr-1">🎯</span>
                Excellent score!
              </div>
            </div>
          </div>
        </div>

        {/* New Activity Feed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                Recent Activity
              </h2>
              <button className="text-indigo-600 hover:text-indigo-800 font-semibold">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  🏆
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">New contest "Algorithm Masters" started!</p>
                  <p className="text-sm text-gray-600">2 hours ago • 156 participants joined</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✅
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Problem "Binary Tree Traversal" solved by 89 users</p>
                  <p className="text-sm text-gray-600">5 hours ago • Difficulty: Medium</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-200/50">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                  📊
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Weekly performance report generated</p>
                  <p className="text-sm text-gray-600">1 day ago • Average score increased by 12%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Quick Stats
            </h2>
            <div className="space-y-6">
              <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                <div className="text-3xl font-black text-indigo-600">24</div>
                <p className="text-sm font-semibold text-gray-700">Problems Solved Today</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <div className="text-3xl font-black text-green-600">7</div>
                <p className="text-sm font-semibold text-gray-700">Current Streak</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
                <div className="text-3xl font-black text-orange-600">92%</div>
                <p className="text-sm font-semibold text-gray-700">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  E
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">EduCode Platform</h3>
                  <p className="text-sm text-gray-600">Empowering coders worldwide</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{new Date().getFullYear()}</p>
                  <p className="text-xs text-gray-500">Year of Innovation</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">24/7</p>
                  <p className="text-xs text-gray-500">Support Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">∞</p>
                  <p className="text-xs text-gray-500">Learning Opportunities</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600 font-medium">
                "Code is poetry written in logic" - Keep coding, keep growing! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
