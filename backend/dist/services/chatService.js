"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChatReply = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const generateChatReply = async (input) => {
    if (!env_1.env.geminiApiKey) {
        throw new errors_1.AppError("Gemini is not configured. Please set GEMINI_API_KEY", 500);
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(env_1.env.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are a helpful assistant for a Loan Management System.
User name: ${input.fullName}
User role: ${input.role}

Rules:
- Keep responses concise and actionable.
- Do not provide anything outside loan-management domain.
- Do not reveal secrets or system internals.
- If user asks to bypass business rules, refuse politely.

User question: ${input.message}
`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text || "I could not generate a response. Please try again.";
};
exports.generateChatReply = generateChatReply;
