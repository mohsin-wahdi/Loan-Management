"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSalarySlipToCloudinary = void 0;
const cloudinary_1 = require("../config/cloudinary");
const errors_1 = require("../utils/errors");
const uploadSalarySlipToCloudinary = async (file) => {
    (0, cloudinary_1.ensureCloudinaryConfigured)();
    if (!file.buffer) {
        throw new errors_1.AppError("Invalid file buffer", 400);
    }
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.cloudinary.uploader.upload_stream({
            folder: "loan-management/salary-slips",
            resource_type: "auto"
        }, (error, result) => {
            if (error || !result) {
                reject(new errors_1.AppError("Failed to upload file to Cloudinary", 500));
                return;
            }
            resolve(result);
        });
        stream.end(file.buffer);
    });
};
exports.uploadSalarySlipToCloudinary = uploadSalarySlipToCloudinary;
