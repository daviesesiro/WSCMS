import { Request, Response, Router } from "express";
import { Subscription } from "../models/Subscription";
import webpush from "../services/webpush";
import { SubscribeController } from "../controllers/subscribe";

const router = Router();

router.post("/api/subscribe", SubscribeController);
router.post("/api/trigger", async (req: Request, res: Response) => {
  const subs = await Subscription.find();
  const payload = JSON.stringify({
    title: req.body.title as string,
    body: req.body.message,
  });
  subs.forEach((sub) => {
    console.log(sub);
    webpush.sendNotification(sub.subscription, payload);
  });

  res.status(200).json({ message: "done" });
});
export default router;
