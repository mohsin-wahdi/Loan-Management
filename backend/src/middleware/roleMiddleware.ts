import { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/User";

export const roleMiddleware = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    next();
  };
};
