"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = exports.decisionSchema = exports.applyLoanSchema = void 0;
const zod_1 = require("zod");
exports.applyLoanSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2),
    pan: zod_1.z.string().regex(/^[0-9]{10}$/),
    dateOfBirth: zod_1.z.string(),
    monthlySalary: zod_1.z.number().positive(),
    employmentMode: zod_1.z.enum(["Salaried", "Self-Employed", "Unemployed"]),
    amount: zod_1.z.number().min(50000).max(500000),
    tenureDays: zod_1.z.number().min(30).max(365)
});
exports.decisionSchema = zod_1.z.object({
    reason: zod_1.z.string().min(3).optional()
});
exports.paymentSchema = zod_1.z.object({
    utr: zod_1.z.string().min(6),
    amount: zod_1.z.number().positive(),
    paymentDate: zod_1.z.string()
});
