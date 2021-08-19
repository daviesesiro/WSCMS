import { Request, Response } from "express";
import { Subscription } from "../models/Subscription";
import webpush from "../services/webpush";

export const SubscribeController = async (req: Request, res: Response) => {
  //get push subscription object from the request
  const subscription = req.body;

  //send status 201 for the request
  res.status(201).json({});

  //create paylod: specified the detals of the push notification
  const payload = JSON.stringify({ title: "You have subscribed to WMCMS" });

  //pass the object into sendNotification fucntion and catch any error
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.error(err));

  await Subscription.create({
    subscription,
    endpoint: subscription.endpoint,
  }).save();
};
