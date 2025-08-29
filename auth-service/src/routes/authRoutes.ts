import express from "express";
const authRouter = express.Router();
import authController from "../controllers/authController";
import { googleLoginHandler } from "../controllers/googleAuthController";
import authMiddleware from "../Middleware/authMiddleware";

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.post("/google", googleLoginHandler);
authRouter.put("/update", authMiddleware, authController.updateUser);
authRouter.put("/update-profile", authMiddleware, authController.updateUserProfile);
authRouter.get("/verify", authMiddleware, (req, res) => {
  res.status(200).json({ message: "User is authenticated" });
  return;
});
authRouter.get("/me", authMiddleware, authController.userDetails);

export default authRouter;
