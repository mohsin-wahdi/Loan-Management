"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPayment = exports.getDisbursedLoans = exports.disburseLoan = exports.getSanctionedLoans = exports.rejectLoan = exports.sanctionLoan = exports.getAppliedLoans = exports.getSalesUsers = exports.getMyLoans = exports.applyLoan = void 0;
const constants_1 = require("../utils/constants");
const loanService = __importStar(require("../services/loanService"));
const loanValidators_1 = require("../validators/loanValidators");
const errors_1 = require("../utils/errors");
const applyLoan = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errors_1.AppError("Not authenticated", 401);
        if (!req.file)
            throw new errors_1.AppError("Salary slip is required", 400);
        const payload = loanValidators_1.applyLoanSchema.parse({
            ...req.body,
            monthlySalary: Number(req.body.monthlySalary),
            amount: Number(req.body.amount),
            tenureDays: Number(req.body.tenureDays)
        });
        const loan = await loanService.applyLoan(req.user.userId, payload, req.file);
        res.status(201).json(loan);
    }
    catch (error) {
        next(error);
    }
};
exports.applyLoan = applyLoan;
const getMyLoans = async (req, res, next) => {
    try {
        if (!req.user)
            throw new errors_1.AppError("Not authenticated", 401);
        const loans = await loanService.getMyLoans(req.user.userId);
        res.json(loans);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyLoans = getMyLoans;
const getSalesUsers = async (_req, res, next) => {
    try {
        const users = await loanService.getRegisteredNotAppliedUsers();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getSalesUsers = getSalesUsers;
const getAppliedLoans = async (_req, res, next) => {
    try {
        res.json(await loanService.listLoansByStatus(constants_1.LOAN_STATUS.APPLIED));
    }
    catch (error) {
        next(error);
    }
};
exports.getAppliedLoans = getAppliedLoans;
const sanctionLoan = async (req, res, next) => {
    try {
        const data = loanValidators_1.decisionSchema.parse(req.body ?? {});
        const loan = await loanService.decideLoan(String(req.params.id), true, data.reason);
        res.json(loan);
    }
    catch (error) {
        next(error);
    }
};
exports.sanctionLoan = sanctionLoan;
const rejectLoan = async (req, res, next) => {
    try {
        const data = loanValidators_1.decisionSchema.parse(req.body);
        const loan = await loanService.decideLoan(String(req.params.id), false, data.reason);
        res.json(loan);
    }
    catch (error) {
        next(error);
    }
};
exports.rejectLoan = rejectLoan;
const getSanctionedLoans = async (_req, res, next) => {
    try {
        res.json(await loanService.listLoansByStatus(constants_1.LOAN_STATUS.SANCTIONED));
    }
    catch (error) {
        next(error);
    }
};
exports.getSanctionedLoans = getSanctionedLoans;
const disburseLoan = async (req, res, next) => {
    try {
        res.json(await loanService.disburseLoan(String(req.params.id)));
    }
    catch (error) {
        next(error);
    }
};
exports.disburseLoan = disburseLoan;
const getDisbursedLoans = async (_req, res, next) => {
    try {
        res.json(await loanService.listLoansByStatus(constants_1.LOAN_STATUS.DISBURSED));
    }
    catch (error) {
        next(error);
    }
};
exports.getDisbursedLoans = getDisbursedLoans;
const addPayment = async (req, res, next) => {
    try {
        const payload = loanValidators_1.paymentSchema.parse({
            ...req.body,
            amount: Number(req.body.amount)
        });
        const loan = await loanService.addPayment(String(req.params.id), payload);
        res.status(201).json(loan);
    }
    catch (error) {
        next(error);
    }
};
exports.addPayment = addPayment;
