import { Request, Response, NextFunction } from "express";
import { loginSchema, signupSchema } from "../validators/authValidators";
import * as authService from "../services/authService";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = signupSchema.parse(req.body);
    const data = await authService.signup(payload);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = loginSchema.parse(req.body);
    const data = await authService.login(payload);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
