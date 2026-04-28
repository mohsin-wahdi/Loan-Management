import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { IUser, UserModel } from "../models/User";
import { AppError } from "../utils/errors";
import { createActivity } from "./activityService";

const signToken = (user: IUser): string =>
  jwt.sign({ userId: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"]
  });

export const signup = async (payload: {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}) => {
  const existing = await UserModel.findOne({ email: payload.email.toLowerCase() });
  if (existing) throw new AppError("Email already in use", 409);

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await UserModel.create({
    fullName: payload.fullName,
    email: payload.email.toLowerCase(),
    password: hashedPassword,
    role: payload.role
  });
  await createActivity(user._id.toString(), "SIGNUP", "User signed up successfully");

  return {
    token: signToken(user),
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
  };
};

export const login = async (payload: { email: string; password: string }) => {
  const user = await UserModel.findOne({ email: payload.email.toLowerCase() });
  if (!user) throw new AppError("Invalid credentials", 401);

  const valid = await bcrypt.compare(payload.password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);
  await createActivity(user._id.toString(), "LOGIN", "User logged in");

  return {
    token: signToken(user),
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
  };
};
