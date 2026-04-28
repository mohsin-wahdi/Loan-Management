"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoanActivities = exports.getMyActivities = exports.createActivity = void 0;
const Activity_1 = require("../models/Activity");
const createActivity = async (userId, action, details) => {
    await Activity_1.ActivityModel.create({
        user: userId,
        action,
        details
    });
};
exports.createActivity = createActivity;
const getMyActivities = async (userId) => Activity_1.ActivityModel.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
exports.getMyActivities = getMyActivities;
const getLoanActivities = async () => Activity_1.ActivityModel.find()
    .populate("user", "fullName email role")
    .sort({ createdAt: -1 })
    .limit(100);
exports.getLoanActivities = getLoanActivities;
