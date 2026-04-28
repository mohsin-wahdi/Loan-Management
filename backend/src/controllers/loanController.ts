import { NextFunction, Request, Response } from "express";
import { LOAN_STATUS } from "../utils/constants";
import * as loanService from "../services/loanService";
import { applyLoanSchema, decisionSchema, paymentSchema } from "../validators/loanValidators";
import { AppError } from "../utils/errors";

export const applyLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);
    if (!req.file) throw new AppError("Salary slip is required", 400);
    const payload = applyLoanSchema.parse({
      ...req.body,
      monthlySalary: Number(req.body.monthlySalary),
      amount: Number(req.body.amount),
      tenureDays: Number(req.body.tenureDays)
    });
    const loan = await loanService.applyLoan(req.user.userId, payload, req.file);
    res.status(201).json(loan);
  } catch (error) {
    next(error);
  }
};

export const getMyLoans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);
    const loans = await loanService.getMyLoans(req.user.userId);
    res.json(loans);
  } catch (error) {
    next(error);
  }
};

export const getSalesUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await loanService.getRegisteredNotAppliedUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getAppliedLoans = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await loanService.listLoansByStatus(LOAN_STATUS.APPLIED));
  } catch (error) {
    next(error);
  }
};

export const sanctionLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = decisionSchema.parse(req.body ?? {});
    const loan = await loanService.decideLoan(String(req.params.id), true, data.reason);
    res.json(loan);
  } catch (error) {
    next(error);
  }
};

export const rejectLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = decisionSchema.parse(req.body);
    const loan = await loanService.decideLoan(String(req.params.id), false, data.reason);
    res.json(loan);
  } catch (error) {
    next(error);
  }
};

export const getSanctionedLoans = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await loanService.listLoansByStatus(LOAN_STATUS.SANCTIONED));
  } catch (error) {
    next(error);
  }
};

export const disburseLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await loanService.disburseLoan(String(req.params.id)));
  } catch (error) {
    next(error);
  }
};

export const getDisbursedLoans = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await loanService.listLoansByStatus(LOAN_STATUS.DISBURSED));
  } catch (error) {
    next(error);
  }
};

export const addPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = paymentSchema.parse({
      ...req.body,
      amount: Number(req.body.amount)
    });
    const loan = await loanService.addPayment(String(req.params.id), payload);
    res.status(201).json(loan);
  } catch (error) {
    next(error);
  }
};
