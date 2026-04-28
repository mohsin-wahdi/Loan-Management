import { Router } from "express";
import { myActivities } from "../controllers/activityController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware);
router.get("/my", myActivities);

export default router;
