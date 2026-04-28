"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: err.issues });
        return;
    }
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    res.status(500).json({ message: "Internal server error", error: err.message });
};
exports.errorHandler = errorHandler;
