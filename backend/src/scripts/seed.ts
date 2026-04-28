import bcrypt from "bcryptjs";
import { connectDb } from "../config/db";
import { UserModel } from "../models/User";
import { USER_ROLES } from "../utils/constants";
import "../config/env";

const users = [
  { fullName: "System Admin", email: "admin@loan.local", role: USER_ROLES.ADMIN },
  { fullName: "Sales User", email: "sales@loan.local", role: USER_ROLES.SALES },
  { fullName: "Sanction User", email: "sanction@loan.local", role: USER_ROLES.SANCTION },
  { fullName: "Disbursement User", email: "disburse@loan.local", role: USER_ROLES.DISBURSEMENT },
  { fullName: "Collection User", email: "collection@loan.local", role: USER_ROLES.COLLECTION },
  { fullName: "Borrower User", email: "borrower@loan.local", role: USER_ROLES.BORROWER }
];

const run = async () => {
  await connectDb();
  const password = await bcrypt.hash("Password@123", 10);

  for (const item of users) {
    await UserModel.findOneAndUpdate(
      { email: item.email },
      { ...item, password },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // eslint-disable-next-line no-console
  console.log("Seed completed. Password for all users: Password@123");
  process.exit(0);
};

run();
