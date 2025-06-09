import { Request, Response } from "express";
import userModel, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, userName } = req.body;

    if (!email || !password || !userName) {
        res.status(400).json({ message: "Missing email, password, or username" });
        return;
    }

    if (password.length < 8) {
        res
            .status(400)
            .json({ message: "Password must be at least 8 characters long" });
        return;
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            email,
            userName,
            password: hashedPassword,
        });

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error("Registration Error:", error);

        if ((error as any).code === 11000) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }

        res.status(500).json({ message: "An error occurred during registration" });
    }
};

type tTokens = {
    accessToken: string;
    refreshToken: string;
};

export const generateToken = (userId: string): tTokens | null => {
    if (!process.env.TOKEN_SECRET) {
        return null;
    }

    const random = Math.random().toString();
  // @ts-ignore
    const accessToken = jwt.sign(
        {
            _id: userId,
            random,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES }
    );

  // @ts-ignore
    const refreshToken = jwt.sign(
        {
            _id: userId,
            random,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    );

    return {
        accessToken,
        refreshToken,
    };
};

const login = async (req: Request, res: Response) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user || !user.password) {
            res.status(400).send("wrong username or password");
            return;
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password as string
        );

        if (!validPassword) {
            res.status(400).send("wrong username or password");
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send("Server Error");
            return;
        }

        const tokens = generateToken(user._id.toString());

        console.log(tokens?.accessToken);
        if (!tokens) {
            res.status(500).send("Server Error");
            return;
        }
        user.refreshToken ??= [];

        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                userName: user.userName,
                profilePicture: user.profilePicture ? `${user.profilePicture}`: null,
            },
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

type tIUser = Document<unknown, {}, IUser> &
    IUser &
    Required<{ _id: string }> & { __v: number };

const verifyRefreshToken = async (refreshToken: string): Promise<tIUser> => {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }

    if (!process.env.TOKEN_SECRET) {
        throw new Error("Server misconfiguration: TOKEN_SECRET is missing");
    }

    const payload = jwt.verify(refreshToken, process.env.TOKEN_SECRET) as {
        _id: string;
    };
    const userId = payload._id;
    const user = await userModel.findOne({
        _id: userId,
        refreshToken: refreshToken,
    });
    if (!user) {
        throw new Error("Invalid or revoked refresh token");
    }

    user.refreshToken = (user.refreshToken ?? []).filter(
        (token) => token !== refreshToken
    );

    return user;
};

const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("accessToken", { httpOnly: true, secure: true });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ error: "Failed to log out." });
    }
};

const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).send("Refresh token missing");
            return;
        }

        const user = await verifyRefreshToken(refreshToken);

        if (!user) {
            res.status(401).send("Invalid refresh token");
            return;
        }

        const tokens = generateToken(user._id);

        if (!tokens) {
            res.status(500).send("Server error while generating tokens");
            return;
        }
        const newRefreshTokens = [
            ...(user.refreshToken ?? []),
            tokens.refreshToken,
        ];

        const updatedUser = await userModel.findOneAndUpdate(
            { _id: user._id },
            { refreshToken: newRefreshTokens },
            { new: true }
        );

        if (!updatedUser) {
            res.status(500).send("Failed to update user");
            return;
        }

        res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
        res.status(200).send("Tokens refreshed successfully");
    } catch (err) {
        console.error("Error refreshing token:", err);
        res.status(401).send("Invalid or expired refresh token");
    }
};

const userDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as IUser)._id;

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        const user = await userModel.findById(userId).select({
            email: 1,
            userName: 1,
            profilePicture: 1,
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                userName: user.userName,
                profilePicture: user.profilePicture ?? null,
            },
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as IUser)._id;

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        const allowedFields = ["email", "userName", "profilePicture"];
        const updates: Partial<IUser> = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                (updates as any)[field] = req.body[field];
            }
        }

        const user = await userModel.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ message: "User updated", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as IUser)._id;

        if (!userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        const update = {
            userProfile: req.body.userProfile,
        };

        const user = await userModel.findByIdAndUpdate(userId, update, { new: true });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ message: "User profile updated", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export default {
    register,
    login,
    refresh,
    logout,
    userDetails,
    updateUser,
    updateUserProfile,
};
