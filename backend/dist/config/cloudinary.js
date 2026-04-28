"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.ensureCloudinaryConfigured = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const env_1 = require("./env");
const errors_1 = require("../utils/errors");
const ensureCloudinaryConfigured = () => {
    if (!env_1.env.cloudinaryCloudName || !env_1.env.cloudinaryApiKey || !env_1.env.cloudinaryApiSecret) {
        throw new errors_1.AppError("Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET", 500);
    }
};
exports.ensureCloudinaryConfigured = ensureCloudinaryConfigured;
cloudinary_1.v2.config({
    cloud_name: env_1.env.cloudinaryCloudName,
    api_key: env_1.env.cloudinaryApiKey,
    api_secret: env_1.env.cloudinaryApiSecret
});
