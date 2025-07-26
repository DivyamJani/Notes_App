import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

const instance = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:8000"
    : "https://noteverse-backend-fyj1.onrender.com",
  withCredentials: true, // very important for cookie-based auth
});

export default instance;
