import { ActivityModel } from "../models/Activity";

export const createActivity = async (userId: string, action: string, details: string) => {
  await ActivityModel.create({
    user: userId,
    action,
    details
  });
};

export const getMyActivities = async (userId: string) =>
  ActivityModel.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
