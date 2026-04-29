"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myActivities = void 0;
const errors_1 = require("../utils/errors");
const activityService_1 = require("../services/activityService");
const myActivities = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errors_1.AppError("Not authenticated", 401);
        const activities = await (0, activityService_1.getMyActivities)(req.user.userId);
        res.json(activities);
    }
    catch (error) {
        next(error);
    }
};
exports.myActivities = myActivities;
