import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z
    .enum(["Admin", "Sales", "Sanction", "Disbursement", "Collection", "Borrower"])
    .optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
