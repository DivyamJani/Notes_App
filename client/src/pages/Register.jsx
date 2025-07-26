import { useState } from "react";
import axios from "../services/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

// ✅ Email regex validator
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const Register = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) {
      errs.name = "Name is required.";
    } else if (form.name.length < 3) {
      errs.name = "Name must be at least 3 characters.";
    }

    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      errs.email = "Please enter a valid email.";
    }

    if (!form.password.trim()) {
      errs.password = "Password is required.";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      const { data } = await axios.post("/api/auth/register", form, {
        withCredentials: true,
      });

      toast.success("🎉 Account created successfully!");
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 transition-all">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <Link to="/" className="text-green-600 hover:text-green-700 text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-green-600 dark:text-white">
            Create Your NoteVerse Account
          </h1>
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full p-2 rounded border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full p-2 rounded border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`w-full p-2 rounded border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } dark:border-gray-600 dark:bg-gray-800 dark:text-white`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
