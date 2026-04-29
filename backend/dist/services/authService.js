"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const errors_1 = require("../utils/errors");
const activityService_1 = require("./activityService");
const signToken = (user) => jsonwebtoken_1.default.sign({ userId: user._id.toString(), role: user.role }, env_1.env.jwtSecret, {
    expiresIn: env_1.env.jwtExpiresIn
});
const signup = async (payload) => {
    const existing = await User_1.UserModel.findOne({ email: payload.email.toLowerCase() });
    if (existing)
        throw new errors_1.AppError("Email already in use", 409);
    const hashedPassword = await bcryptjs_1.default.hash(payload.password, 10);
    const user = await User_1.UserModel.create({
        fullName: payload.fullName,
        email: payload.email.toLowerCase(),
        password: hashedPassword,
        role: payload.role
    });
    await (0, activityService_1.createActivity)(user._id.toString(), "SIGNUP", "User signed up successfully");
    return {
        token: signToken(user),
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    };
};
exports.signup = signup;
const login = async (payload) => {
    const user = await User_1.UserModel.findOne({ email: payload.email.toLowerCase() });
    if (!user)
        throw new errors_1.AppError("Invalid credentials", 401);
    const valid = await bcryptjs_1.default.compare(payload.password, user.password);
    if (!valid)
        throw new errors_1.AppError("Invalid credentials", 401);
    await (0, activityService_1.createActivity)(user._id.toString(), "LOGIN", "User logged in");
    return {
        token: signToken(user),
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    };
};
exports.login = login;
