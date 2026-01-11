import "./App.css";
import Login from "./pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Contests from "./pages/Contests";
import ContestDetails from "./pages/ContestDetails";

// inside <Routes> ...

import Problems from "./pages/Problems";
import RefreshHandler from "./RefreshHandler";
import { useState } from "react";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false);

  // Protect routes
  const PrivateRouting = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <RefreshHandler setIsAuthenticated={setisAuthenticated} />
      <Routes>
        {/* Default route -> Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/home" element={<PrivateRouting element={<Home />} />} />
        <Route
          path="/dashboard"
          element={<PrivateRouting element={<Home />} />}
        />
        <Route
          path="/contests"
          element={<PrivateRouting element={<Contests />} />}
        />
        <Route
          path="/problems"
          element={<PrivateRouting element={<Problems />} />}
        />
        <Route
          path="/Analytics"
          element={<PrivateRouting element={<Analytics />} />}
        />
        <Route
          path="/contest/:id"
          element={<PrivateRouting element={<ContestDetails />} />}
        />
        <Route
          path="/settings"
          element={<PrivateRouting element={<Settings />} />}
        />
      </Routes>
    </div>
  );
}

export default App;
