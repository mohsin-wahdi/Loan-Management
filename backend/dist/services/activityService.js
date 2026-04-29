"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyActivities = exports.createActivity = void 0;
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
