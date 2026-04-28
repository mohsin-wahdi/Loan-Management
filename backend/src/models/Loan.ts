import mongoose, { Document, Schema, Types } from "mongoose";
import { LOAN_STATUS } from "../utils/constants";

export type LoanStatus = (typeof LOAN_STATUS)[keyof typeof LOAN_STATUS];

export interface ILoan extends Document {
  user: Types.ObjectId;
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  age: number;
  monthlySalary: number;
  employmentMode: "Salaried" | "Self-Employed" | "Unemployed";
  amount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingBalance: number;
  status: LoanStatus;
  rejectionReason?: string;
  riskSummary: string;
}

const loanSchema = new Schema<ILoan>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    pan: { type: String, required: true, uppercase: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    monthlySalary: { type: Number, required: true },
    employmentMode: {
      type: String,
      enum: ["Salaried", "Self-Employed", "Unemployed"],
      required: true
    },
    amount: { type: Number, required: true },
    tenureDays: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    simpleInterest: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },
    totalPaid: { type: Number, default: 0 },
    outstandingBalance: { type: Number, required: true },
    status: { type: String, enum: Object.values(LOAN_STATUS), required: true },
    rejectionReason: { type: String },
    riskSummary: { type: String, required: true }
  },
  { timestamps: true }
);

export const LoanModel = mongoose.model<ILoan>("Loan", loanSchema);
