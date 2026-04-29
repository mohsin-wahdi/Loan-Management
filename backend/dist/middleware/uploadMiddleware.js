"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../utils/errors");
const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new errors_1.AppError("Only PDF/JPG/PNG files are allowed", 400));
            return;
        }
        cb(null, true);
    }
});
