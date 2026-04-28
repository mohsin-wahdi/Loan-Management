import { UploadApiResponse } from "cloudinary";
import { cloudinary, ensureCloudinaryConfigured } from "../config/cloudinary";
import { AppError } from "../utils/errors";

export const uploadSalarySlipToCloudinary = async (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  ensureCloudinaryConfigured();

  if (!file.buffer) {
    throw new AppError("Invalid file buffer", 400);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "loan-management/salary-slips",
        resource_type: "auto"
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError("Failed to upload file to Cloudinary", 500));
          return;
        }
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });
};
