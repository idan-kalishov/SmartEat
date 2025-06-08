"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const googleAuthController_1 = require("../controllers/googleAuthController");
const googleRouter = express_1.default.Router();
googleRouter.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
googleRouter.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), googleAuthController_1.googleLoginHandler);
exports.default = googleRouter;
