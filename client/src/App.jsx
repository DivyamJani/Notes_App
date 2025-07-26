import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen"; // ✅ NEW

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  return children;
};

const App = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthRoute = ["/login", "/register"].includes(location.pathname);
  const isHomeRoute = location.pathname === "/";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Show splash screen if loading
  if (loading) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      {!isAuthRoute && !isHomeRoute && user && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div className="p-4">404 Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
