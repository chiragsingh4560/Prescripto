import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// Initialize app
const app = express();

// Connect to database & cloud services
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(
  cors({
   origin: [
      "http://localhost:3000", // For local frontend
      "https://prescripto-admin-livid.vercel.app", // Allow admin frontend domain
      "https://prescripto-chirag-singhs-projects-34dcef31.vercel.app", // For main frontend domains
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);


// API Routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API IS WORKING !!! WOHOOo");
});

// Export the app for Vercel
export default app;
