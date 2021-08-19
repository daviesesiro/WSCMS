import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import subscribeRoute from "./routes/subscribe";
import authRoute from "./routes/auth";
import dashboardRoute from "./routes/dashboard";
import { createConnection } from "typeorm";

const app = express();
createConnection().then(() => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.set("views", path.join(__dirname, "../client"));
  app.set("view engine", "ejs");

  app.use(express.static(path.join(__dirname, "../client/static")));

  app.use(subscribeRoute);
  app.use(authRoute);
  app.use(dashboardRoute);

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
  );
});
