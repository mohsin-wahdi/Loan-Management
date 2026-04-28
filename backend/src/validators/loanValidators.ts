import { z } from "zod";

export const applyLoanSchema = z.object({
  fullName: z.string().min(2),
  pan: z.string().regex(/^[0-9]{10}$/),
  dateOfBirth: z.string(),
  monthlySalary: z.number().positive(),
  employmentMode: z.enum(["Salaried", "Self-Employed", "Unemployed"]),
  amount: z.number().min(50000).max(500000),
  tenureDays: z.number().min(30).max(365)
});

export const decisionSchema = z.object({
  reason: z.string().min(3).optional()
});

export const paymentSchema = z.object({
  utr: z.string().min(6),
  amount: z.number().positive(),
  paymentDate: z.string()
});
