"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLoansByStatus = exports.addPayment = exports.disburseLoan = exports.decideLoan = exports.getRegisteredNotAppliedUsers = exports.getMyLoans = exports.applyLoan = void 0;
const Document_1 = require("../models/Document");
const Loan_1 = require("../models/Loan");
const Payment_1 = require("../models/Payment");
const User_1 = require("../models/User");
const constants_1 = require("../utils/constants");
const errors_1 = require("../utils/errors");
const aiService_1 = require("./aiService");
const uploadService_1 = require("./uploadService");
const activityService_1 = require("./activityService");
const getAge = (dob) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate()))
        age--;
    return age;
};
const validateBusinessRules = (input) => {
    if (input.age < 23 || input.age > 50)
        throw new errors_1.AppError("Age must be between 23 and 50 years");
    if (input.monthlySalary < 25000)
        throw new errors_1.AppError("Monthly salary must be at least 25000");
    if (!/^[0-9]{10}$/.test(input.pan))
        throw new errors_1.AppError("PAN must be 10 digits");
    if (input.employmentMode === "Unemployed")
        throw new errors_1.AppError("Unemployed applicants are not eligible");
};
const applyLoan = async (userId, input, file) => {
    const dob = new Date(input.dateOfBirth);
    const age = getAge(dob);
    validateBusinessRules({
        age,
        monthlySalary: input.monthlySalary,
        pan: input.pan,
        employmentMode: input.employmentMode
    });
    const simpleInterest = Number(((input.amount * constants_1.INTEREST_RATE * input.tenureDays) / (365 * 100)).toFixed(2));
    const totalRepayment = Number((input.amount + simpleInterest).toFixed(2));
    const uploadResult = await (0, uploadService_1.uploadSalarySlipToCloudinary)(file);
    const riskSummary = await (0, aiService_1.generateLoanRiskSummary)({
        age,
        monthlySalary: input.monthlySalary,
        employmentMode: input.employmentMode
    });
    const loan = await Loan_1.LoanModel.create({
        user: userId,
        fullName: input.fullName,
        pan: input.pan,
        dateOfBirth: dob,
        age,
        monthlySalary: input.monthlySalary,
        employmentMode: input.employmentMode,
        amount: input.amount,
        tenureDays: input.tenureDays,
        interestRate: constants_1.INTEREST_RATE,
        simpleInterest,
        totalRepayment,
        totalPaid: 0,
        outstandingBalance: totalRepayment,
        status: constants_1.LOAN_STATUS.APPLIED,
        riskSummary
    });
    await Document_1.DocumentModel.create({
        user: userId,
        loan: loan._id,
        filePath: uploadResult.secure_url,
        fileType: file.mimetype,
        originalName: file.originalname
    });
    await User_1.UserModel.findByIdAndUpdate(userId, { hasApplied: true });
    await (0, activityService_1.createActivity)(userId, "LOAN_APPLIED", `Loan applied for amount ${input.amount}`);
    return loan;
};
exports.applyLoan = applyLoan;
const getMyLoans = async (userId) => Loan_1.LoanModel.find({ user: userId }).sort({ createdAt: -1 });
exports.getMyLoans = getMyLoans;
const getRegisteredNotAppliedUsers = async () => User_1.UserModel.find({ hasApplied: false, role: "Borrower" }).select("-password").sort({ createdAt: -1 });
exports.getRegisteredNotAppliedUsers = getRegisteredNotAppliedUsers;
const decideLoan = async (loanId, approve, reason) => {
    const loan = await Loan_1.LoanModel.findById(loanId);
    if (!loan)
        throw new errors_1.AppError("Loan not found", 404);
    if (loan.status !== constants_1.LOAN_STATUS.APPLIED)
        throw new errors_1.AppError("Only APPLIED loans can be processed");
    if (!approve && !reason)
        throw new errors_1.AppError("Rejection reason is required");
    loan.status = approve ? constants_1.LOAN_STATUS.SANCTIONED : constants_1.LOAN_STATUS.REJECTED;
    loan.rejectionReason = approve ? undefined : reason;
    await loan.save();
    await (0, activityService_1.createActivity)(loan.user.toString(), approve ? "LOAN_SANCTIONED" : "LOAN_REJECTED", approve ? "Loan sanctioned by sanction team" : `Loan rejected: ${reason}`);
    return loan;
};
exports.decideLoan = decideLoan;
const disburseLoan = async (loanId) => {
    const loan = await Loan_1.LoanModel.findById(loanId);
    if (!loan)
        throw new errors_1.AppError("Loan not found", 404);
    if (loan.status !== constants_1.LOAN_STATUS.SANCTIONED)
        throw new errors_1.AppError("Only SANCTIONED loans can be disbursed");
    loan.status = constants_1.LOAN_STATUS.DISBURSED;
    await loan.save();
    await (0, activityService_1.createActivity)(loan.user.toString(), "LOAN_DISBURSED", "Loan marked as disbursed");
    return loan;
};
exports.disburseLoan = disburseLoan;
const addPayment = async (loanId, payload) => {
    const loan = await Loan_1.LoanModel.findById(loanId);
    if (!loan)
        throw new errors_1.AppError("Loan not found", 404);
    if (loan.status !== constants_1.LOAN_STATUS.DISBURSED)
        throw new errors_1.AppError("Only DISBURSED loans can receive payments");
    if (payload.amount <= 0)
        throw new errors_1.AppError("Payment amount must be greater than 0");
    const existingUtr = await Payment_1.PaymentModel.findOne({ utr: payload.utr.toUpperCase() });
    if (existingUtr)
        throw new errors_1.AppError("UTR must be globally unique");
    const projectedTotal = Number((loan.totalPaid + payload.amount).toFixed(2));
    if (projectedTotal > loan.totalRepayment)
        throw new errors_1.AppError("Total paid cannot exceed total repayment");
    await Payment_1.PaymentModel.create({
        loan: loan._id,
        utr: payload.utr.toUpperCase(),
        amount: payload.amount,
        paymentDate: new Date(payload.paymentDate)
    });
    loan.totalPaid = projectedTotal;
    loan.outstandingBalance = Number((loan.totalRepayment - projectedTotal).toFixed(2));
    if (loan.totalPaid === loan.totalRepayment) {
        loan.status = constants_1.LOAN_STATUS.CLOSED;
        await (0, activityService_1.createActivity)(loan.user.toString(), "LOAN_CLOSED", "Loan auto-closed after full repayment");
    }
    await loan.save();
    await (0, activityService_1.createActivity)(loan.user.toString(), "PAYMENT_ADDED", `Payment of ${payload.amount} received with UTR ${payload.utr.toUpperCase()}`);
    return loan;
};
exports.addPayment = addPayment;
const listLoansByStatus = async (status) => Loan_1.LoanModel.find({ status }).populate("user", "fullName email role").sort({ createdAt: -1 });
exports.listLoansByStatus = listLoansByStatus;
