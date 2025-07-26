import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotesProvider from "./context/NotesContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotesProvider> {/* ✅ Wrap App with NotesProvider */}
          <App />
          <ToastContainer />
        </NotesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
