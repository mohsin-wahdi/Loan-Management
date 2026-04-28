import multer from "multer";
import { AppError } from "../utils/errors";

const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new AppError("Only PDF/JPG/PNG files are allowed", 400));
      return;
    }
    cb(null, true);
  }
});
