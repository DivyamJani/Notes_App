import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/notesRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";
import glossaryRoutes from "./routes/glossaryRoutes.js";
const app = express();

// app.use(cors({
//   origin: function (origin, callback) {
//     const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
//     if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));


// Use the CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
    // console.log("CORS_ORIGIN", process.env.CORS_ORIGIN); // Debug log to check the CORS_ORIGIN
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Welcome to the API"); 
});
// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/insight",insightRoutes);
app.use("/api/glossary",glossaryRoutes);


export { app };
