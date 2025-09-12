import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handlError, handleSuccess } from "../utils";

const Signup = () => {
  const navigate = useNavigate();

  const [signupInfo, setsignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copysignupInfo = { ...signupInfo };
    copysignupInfo[name] = value;
    setsignupInfo(copysignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handlError("All fields are required");
    }

    try {
      const url = "http://127.0.0.1:8080/api/v1/user/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (error) {
        const details = error[0].message;
        handlError(details);
      } else if (!success) {
        handlError(message);
      }
    } catch (error) {
      handlError(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sign Up
        </h1>
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Enter your name..."
              value={signupInfo.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              autoFocus
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={signupInfo.password}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            Sign Up
          </button>

          {/* Link to login */}
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Login
            </Link>
          </p>

          <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default Signup;
