import { Request, Response } from "express";

export const signin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email == "daviesesiro@gmail.com" && password == "password") {
    return res.redirect("/dashboard");
  }

  res.status(401).render("index", { error: "User not found" });
};

export const getSignin = (_req: Request, res: Response) => {
  res.render("index", { error: "" });
};
