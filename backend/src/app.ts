import cors from "cors";
import express from "express";
import path from "path";
import authRoutes from "./routes/authRoutes";
import loanRoutes from "./routes/loanRoutes";
import activityRoutes from "./routes/activityRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

export const app = express();

app.use(
  cors({
    origin: env.frontendUrl
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/activities", activityRoutes);

app.use(errorHandler);
