import mongoose, { Document, Schema } from "mongoose";
import { USER_ROLES } from "../utils/constants";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  hasApplied: boolean;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.BORROWER
    },
    hasApplied: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
