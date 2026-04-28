import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";
import { envVars } from "./app/config/env";

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
// now we are working with from data so for form data we have to do this below this will handle form data without any issue
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api/v1", router);
app.use((req, res, next) => {
  console.log("Request URL:", req.originalUrl);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour management system",
  });
});

// Global Error handler
app.use(globalErrorHandler);

app.use(notFound);

export default app;
