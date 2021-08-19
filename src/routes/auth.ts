import { Router } from "express";
import { getSignin, signin } from "../controllers/signin";

const router = Router();

router.post("/", signin);
router.get("/", getSignin);

export default router;
