import { DocumentModel } from "../models/Document";
import { LoanModel } from "../models/Loan";
import { PaymentModel } from "../models/Payment";
import { UserModel } from "../models/User";
import { INTEREST_RATE, LOAN_STATUS } from "../utils/constants";
import { AppError } from "../utils/errors";
import { generateLoanRiskSummary } from "./aiService";
import { uploadSalarySlipToCloudinary } from "./uploadService";
import { createActivity } from "./activityService";

const getAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

const validateBusinessRules = (input: {
  age: number;
  monthlySalary: number;
  pan: string;
  employmentMode: string;
}) => {
  if (input.age < 23 || input.age > 50) throw new AppError("Age must be between 23 and 50 years");
  if (input.monthlySalary < 25000) throw new AppError("Monthly salary must be at least 25000");
  if (!/^[0-9]{10}$/.test(input.pan)) throw new AppError("PAN must be 10 digits");
  if (input.employmentMode === "Unemployed") throw new AppError("Unemployed applicants are not eligible");
};

export const applyLoan = async (
  userId: string,
  input: {
    fullName: string;
    pan: string;
    dateOfBirth: string;
    monthlySalary: number;
    employmentMode: "Salaried" | "Self-Employed" | "Unemployed";
    amount: number;
    tenureDays: number;
  },
  file: Express.Multer.File
) => {
  const dob = new Date(input.dateOfBirth);
  const age = getAge(dob);
  validateBusinessRules({
    age,
    monthlySalary: input.monthlySalary,
    pan: input.pan,
    employmentMode: input.employmentMode
  });

  const simpleInterest = Number(
    ((input.amount * INTEREST_RATE * input.tenureDays) / (365 * 100)).toFixed(2)
  );
  const totalRepayment = Number((input.amount + simpleInterest).toFixed(2));
  const uploadResult = await uploadSalarySlipToCloudinary(file);
  const riskSummary = await generateLoanRiskSummary({
    age,
    monthlySalary: input.monthlySalary,
    employmentMode: input.employmentMode
  });

  const loan = await LoanModel.create({
    user: userId,
    fullName: input.fullName,
    pan: input.pan,
    dateOfBirth: dob,
    age,
    monthlySalary: input.monthlySalary,
    employmentMode: input.employmentMode,
    amount: input.amount,
    tenureDays: input.tenureDays,
    interestRate: INTEREST_RATE,
    simpleInterest,
    totalRepayment,
    totalPaid: 0,
    outstandingBalance: totalRepayment,
    status: LOAN_STATUS.APPLIED,
    riskSummary
  });

  await DocumentModel.create({
    user: userId,
    loan: loan._id,
    filePath: uploadResult.secure_url,
    fileType: file.mimetype,
    originalName: file.originalname
  });

  await UserModel.findByIdAndUpdate(userId, { hasApplied: true });
  await createActivity(userId, "LOAN_APPLIED", `Loan applied for amount ${input.amount}`);
  return loan;
};

export const getMyLoans = async (userId: string) => LoanModel.find({ user: userId }).sort({ createdAt: -1 });

export const getRegisteredNotAppliedUsers = async () =>
  UserModel.find({ hasApplied: false, role: "Borrower" }).select("-password").sort({ createdAt: -1 });

export const decideLoan = async (loanId: string, approve: boolean, reason?: string) => {
  const loan = await LoanModel.findById(loanId);
  if (!loan) throw new AppError("Loan not found", 404);
  if (loan.status !== LOAN_STATUS.APPLIED) throw new AppError("Only APPLIED loans can be processed");

  if (!approve && !reason) throw new AppError("Rejection reason is required");
  loan.status = approve ? LOAN_STATUS.SANCTIONED : LOAN_STATUS.REJECTED;
  loan.rejectionReason = approve ? undefined : reason;
  await loan.save();
  await createActivity(
    loan.user.toString(),
    approve ? "LOAN_SANCTIONED" : "LOAN_REJECTED",
    approve ? "Loan sanctioned by sanction team" : `Loan rejected: ${reason}`
  );
  return loan;
};

export const disburseLoan = async (loanId: string) => {
  const loan = await LoanModel.findById(loanId);
  if (!loan) throw new AppError("Loan not found", 404);
  if (loan.status !== LOAN_STATUS.SANCTIONED) throw new AppError("Only SANCTIONED loans can be disbursed");

  loan.status = LOAN_STATUS.DISBURSED;
  await loan.save();
  await createActivity(loan.user.toString(), "LOAN_DISBURSED", "Loan marked as disbursed");
  return loan;
};

export const addPayment = async (loanId: string, payload: { utr: string; amount: number; paymentDate: string }) => {
  const loan = await LoanModel.findById(loanId);
  if (!loan) throw new AppError("Loan not found", 404);
  if (loan.status !== LOAN_STATUS.DISBURSED) throw new AppError("Only DISBURSED loans can receive payments");

  if (payload.amount <= 0) throw new AppError("Payment amount must be greater than 0");

  const existingUtr = await PaymentModel.findOne({ utr: payload.utr.toUpperCase() });
  if (existingUtr) throw new AppError("UTR must be globally unique");

  const projectedTotal = Number((loan.totalPaid + payload.amount).toFixed(2));
  if (projectedTotal > loan.totalRepayment) throw new AppError("Total paid cannot exceed total repayment");

  await PaymentModel.create({
    loan: loan._id,
    utr: payload.utr.toUpperCase(),
    amount: payload.amount,
    paymentDate: new Date(payload.paymentDate)
  });

  loan.totalPaid = projectedTotal;
  loan.outstandingBalance = Number((loan.totalRepayment - projectedTotal).toFixed(2));
  if (loan.totalPaid === loan.totalRepayment) {
    loan.status = LOAN_STATUS.CLOSED;
    await createActivity(loan.user.toString(), "LOAN_CLOSED", "Loan auto-closed after full repayment");
  }
  await loan.save();
  await createActivity(
    loan.user.toString(),
    "PAYMENT_ADDED",
    `Payment of ${payload.amount} received with UTR ${payload.utr.toUpperCase()}`
  );
  return loan;
};

export const listLoansByStatus = async (status: string) =>
  LoanModel.find({ status }).populate("user", "fullName email role").sort({ createdAt: -1 });
