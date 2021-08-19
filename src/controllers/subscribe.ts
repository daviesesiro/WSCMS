import { Request, Response } from "express";
import { Subscription } from "../models/Subscription";

export const SubscribeController = async (req: Request, res: Response) => {
  //get push subscription object from the request
  const subscription = req.body;

  //send status 201 for the request
  res.status(201).json({});

  await Subscription.create({
    subscription,
    endpoint: subscription.endpoint,
  }).save();
};
