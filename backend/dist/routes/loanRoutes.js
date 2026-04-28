"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loanController = __importStar(require("../controllers/loanController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const constants_1 = require("../utils/constants");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post("/apply", (0, roleMiddleware_1.roleMiddleware)([constants_1.USER_ROLES.BORROWER]), uploadMiddleware_1.upload.single("salarySlip"), loanController.applyLoan);
router.get("/my-loans", (0, roleMiddleware_1.roleMiddleware)([constants_1.USER_ROLES.BORROWER]), loanController.getMyLoans);
router.get("/sales/not-applied-users", (0, roleMiddleware_1.roleMiddleware)([constants_1.USER_ROLES.SALES, constants_1.USER_ROLES.ADMIN]), loanController.getSalesUsers);
router.get("/sanction/applied", (0, roleMiddleware_1.roleMiddleware)([constants_1.USER_ROLES.SANCTION, constants_1.USER_ROLES.ADMIN]), loanController.getAppliedLoans);
router.post("/sanction/:id/approve", (0, roleMiddleware_1.roleMiddleware)([constants_1.USER_ROLES.SANCTION, constants_1.USER_ROLES.ADMIN]), loanController.sanctionLoan);
router.post("/sanction/:id/reject", (0, roleMiddleware_1.roleMiddleware)([constants_1.USER_ROLES.SANCTION, constants_1.USER_ROLES.ADMIN]), loanController.rejectLoan);
router.get("/disbursement/sanctioned", (0, roleMiddleware_1.roleMiddleware)([constants_1.USER_ROLES.DISBURSEMENT, constants_1.USER_ROLES.ADMIN]), loanController.getSanctionedLoans);
router.post("/disbursement/:id/disburse", (0, roleMiddleware_1.roleMiddleware)([constants_1.USER_ROLES.DISBURSEMENT, constants_1.USER_ROLES.ADMIN]), loanController.disburseLoan);
router.get("/collection/disbursed", (0, roleMiddleware_1.roleMiddleware)([constants_1.USER_ROLES.COLLECTION, constants_1.USER_ROLES.ADMIN]), loanController.getDisbursedLoans);
router.post("/collection/:id/payments", (0, roleMiddleware_1.roleMiddleware)([constants_1.USER_ROLES.COLLECTION, constants_1.USER_ROLES.ADMIN]), loanController.addPayment);
exports.default = router;
