"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const constants_1 = require("../utils/constants");
require("../config/env");
const users = [
    { fullName: "System Admin", email: "admin@loan.local", role: constants_1.USER_ROLES.ADMIN },
    { fullName: "Sales User", email: "sales@loan.local", role: constants_1.USER_ROLES.SALES },
    { fullName: "Sanction User", email: "sanction@loan.local", role: constants_1.USER_ROLES.SANCTION },
    { fullName: "Disbursement User", email: "disburse@loan.local", role: constants_1.USER_ROLES.DISBURSEMENT },
    { fullName: "Collection User", email: "collection@loan.local", role: constants_1.USER_ROLES.COLLECTION },
    { fullName: "Borrower User", email: "borrower@loan.local", role: constants_1.USER_ROLES.BORROWER }
];
const run = async () => {
    await (0, db_1.connectDb)();
    const password = await bcryptjs_1.default.hash("Password@123", 10);
    for (const item of users) {
        await User_1.UserModel.findOneAndUpdate({ email: item.email }, { ...item, password }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    // eslint-disable-next-line no-console
    console.log("Seed completed. Password for all users: Password@123");
    process.exit(0);
};
run();
