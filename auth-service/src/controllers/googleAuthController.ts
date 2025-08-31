import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import userModel from "../models/User";
import { generateToken } from "./authController";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Handler for Google OAuth token verification
export const googleLoginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ message: "ID token is required" });
      return;
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      res.status(400).json({ message: "Email is required from Google" });
      return;
    }

    // Find or create user by email
    let user = await userModel.findOne({ email });
    if (!user) {
      // If no user with this email, create a new one
      user = await userModel.create({
        email,
        userName: name,
        profilePicture: picture,
      });
    } else {
      // If user exists, update profile info if not already set
      if (!user.userName) user.userName = name;
      if (!user.profilePicture) user.profilePicture = picture;
      await user.save();
    }

    // Generate JWT tokens
    const tokens = generateToken(user._id);
    if (!tokens) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Lax in development
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Lax in development
    });

    // Return user data and tokens
    res.status(200).json({
      message: "Google authentication successful",
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        profilePicture: user.profilePicture,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
