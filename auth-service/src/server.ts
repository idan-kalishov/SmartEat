// server.ts (or app.ts)
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import mongoose from "mongoose";
import passport from "passport";
import path from "path";
import authRoutes from "./routes/authRoutes";
import initializePassport from "./passport";

export function createServer(): Application {
  dotenv.config();

  const app: Application = express();

  // Initialize Passport for Google OAuth strategy etc.
  initializePassport();
  app.use(passport.initialize());
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  const corsOptions = {
    origin: (origin: any, callback: any) => {
      if (!origin) return callback(null, true);

      callback(null, true);
    },
    credentials: true,
  };

  app.use(cors(corsOptions));

  // Serve static files (e.g., uploaded images)
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  // Additional middleware
  app.use(express.json());
  app.use(bodyParser.json());

  // Set up routes
  app.use("/auth", authRoutes);

  if (!process.env.DB_CONNECT) {
    throw new Error("DB_CONNECT environment variable is not defined");
  }

  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => console.log("Connected to the database"))
    .catch((err: Error) => console.error("MongoDB connection error:", err));

  return app;
}
