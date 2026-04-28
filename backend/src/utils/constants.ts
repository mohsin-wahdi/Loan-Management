export const INTEREST_RATE = 12;

export const LOAN_STATUS = {
  APPLIED: "APPLIED",
  SANCTIONED: "SANCTIONED",
  REJECTED: "REJECTED",
  DISBURSED: "DISBURSED",
  CLOSED: "CLOSED"
} as const;

export const USER_ROLES = {
  ADMIN: "Admin",
  SALES: "Sales",
  SANCTION: "Sanction",
  DISBURSEMENT: "Disbursement",
  COLLECTION: "Collection",
  BORROWER: "Borrower"
} as const;
