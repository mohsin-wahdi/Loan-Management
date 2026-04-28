import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { getMyActivities } from "../services/activityService";

export const myActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);
    const activities = await getMyActivities(req.user.userId);
    res.json(activities);
  } catch (error) {
    next(error);
  }
};
