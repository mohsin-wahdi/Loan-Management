"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const errors_1 = require("../utils/errors");
const chatValidators_1 = require("../validators/chatValidators");
const chatService_1 = require("../services/chatService");
const User_1 = require("../models/User");
const chat = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errors_1.AppError("Not authenticated", 401);
        const payload = chatValidators_1.chatSchema.parse(req.body);
        const user = await User_1.UserModel.findById(req.user.userId).select("fullName role");
        if (!user)
            throw new errors_1.AppError("User not found", 404);
        const reply = await (0, chatService_1.generateChatReply)({
            message: payload.message,
            role: user.role,
            fullName: user.fullName
        });
        res.json({ reply });
    }
    catch (error) {
        next(error);
    }
};
exports.chat = chat;
