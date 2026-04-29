"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const required = [
    "PORT",
    "MONGO_URI",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "FRONTEND_URL"
];
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}
exports.env = {
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    frontendUrl: process.env.FRONTEND_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
};
