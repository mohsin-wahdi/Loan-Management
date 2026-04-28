import { Router } from "express";
import * as loanController from "../controllers/loanController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import { USER_ROLES } from "../utils/constants";

const router = Router();

router.use(authMiddleware);

router.post(
  "/apply",
  roleMiddleware([USER_ROLES.BORROWER]),
  upload.single("salarySlip"),
  loanController.applyLoan
);
router.get("/my-loans", roleMiddleware([USER_ROLES.BORROWER]), loanController.getMyLoans);

router.get(
  "/sales/not-applied-users",
  roleMiddleware([USER_ROLES.SALES, USER_ROLES.ADMIN]),
  loanController.getSalesUsers
);

router.get(
  "/sanction/applied",
  roleMiddleware([USER_ROLES.SANCTION, USER_ROLES.ADMIN]),
  loanController.getAppliedLoans
);
router.post(
  "/sanction/:id/approve",
  roleMiddleware([USER_ROLES.SANCTION, USER_ROLES.ADMIN]),
  loanController.sanctionLoan
);
router.post(
  "/sanction/:id/reject",
  roleMiddleware([USER_ROLES.SANCTION, USER_ROLES.ADMIN]),
  loanController.rejectLoan
);

router.get(
  "/disbursement/sanctioned",
  roleMiddleware([USER_ROLES.DISBURSEMENT, USER_ROLES.ADMIN]),
  loanController.getSanctionedLoans
);
router.post(
  "/disbursement/:id/disburse",
  roleMiddleware([USER_ROLES.DISBURSEMENT, USER_ROLES.ADMIN]),
  loanController.disburseLoan
);

router.get(
  "/collection/disbursed",
  roleMiddleware([USER_ROLES.COLLECTION, USER_ROLES.ADMIN]),
  loanController.getDisbursedLoans
);
router.post(
  "/collection/:id/payments",
  roleMiddleware([USER_ROLES.COLLECTION, USER_ROLES.ADMIN]),
  loanController.addPayment
);

export default router;
