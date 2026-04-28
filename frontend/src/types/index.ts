export type Role = "Admin" | "Sales" | "Sanction" | "Disbursement" | "Collection" | "Borrower";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

export interface Loan {
  _id: string;
  fullName: string;
  pan: string;
  age: number;
  monthlySalary: number;
  employmentMode: "Salaried" | "Self-Employed" | "Unemployed";
  amount: number;
  tenureDays: number;
  simpleInterest: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingBalance: number;
  status: "APPLIED" | "SANCTIONED" | "REJECTED" | "DISBURSED" | "CLOSED";
  rejectionReason?: string;
  riskSummary: string;
}

export interface Activity {
  _id: string;
  action: string;
  details: string;
  createdAt: string;
}
