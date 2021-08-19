import { Router } from "express";
import { SubscribeController } from "../controllers/subscribe";

const router = Router();

router.post("/api/subscribe", SubscribeController);

export default router;
