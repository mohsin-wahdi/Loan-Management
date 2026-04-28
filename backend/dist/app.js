"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const loanRoutes_1 = __importDefault(require("./routes/loanRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const env_1 = require("./config/env");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: env_1.env.frontendUrl
}));
exports.app.use(express_1.default.json());
exports.app.use("/uploads", express_1.default.static(path_1.default.resolve(process.cwd(), "uploads")));
exports.app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
exports.app.use("/api/auth", authRoutes_1.default);
exports.app.use("/api/loans", loanRoutes_1.default);
exports.app.use("/api/activities", activityRoutes_1.default);
exports.app.use("/api/chat", chatRoutes_1.default);
exports.app.use(errorHandler_1.errorHandler);
