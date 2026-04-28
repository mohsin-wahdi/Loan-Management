"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ROLES = exports.LOAN_STATUS = exports.INTEREST_RATE = void 0;
exports.INTEREST_RATE = 12;
exports.LOAN_STATUS = {
    APPLIED: "APPLIED",
    SANCTIONED: "SANCTIONED",
    REJECTED: "REJECTED",
    DISBURSED: "DISBURSED",
    CLOSED: "CLOSED"
};
exports.USER_ROLES = {
    ADMIN: "Admin",
    SALES: "Sales",
    SANCTION: "Sanction",
    DISBURSEMENT: "Disbursement",
    COLLECTION: "Collection",
    BORROWER: "Borrower"
};
