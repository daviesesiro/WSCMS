import { Request, Response } from "express";

export const getDashboard = (_req: Request, res: Response) => {
  res.render("dashboard");
};
