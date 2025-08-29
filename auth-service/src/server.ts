// server.ts (or app.ts)
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import mongoose from "mongoose";
import path from "path";
import authRoutes from "./routes/authRoutes";

export function createServer(): Application {
  dotenv.config();

  const app: Application = express();

  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  const corsOptions = {
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
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
