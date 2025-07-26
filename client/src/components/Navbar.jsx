// ==== Navbar.jsx ====
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "../services/axiosInstance";

// import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.get("/api/auth/logout", { withCredentials: true });
    setUser(null);
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
      <Link to="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-white">
        NoteVerse
      </Link>

      <div className="flex items-center gap-4">
        {user && (
          <span className="hidden sm:block text-gray-700 dark:text-gray-300">
            Welcome, <strong>{user.name}</strong>
          </span>
        )}

        <Link
          to="/"
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
        >
          Home
        </Link>

        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;