import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { NextFunction, Request, Response, Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { Role } from "./user.interface";
const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No Token Recieved");
      }
      const verifyToken = jwt.verify(accessToken as string, "secret");

      if (!verifyToken) {
        throw new AppError(403, `You are not authorized ${verifyToken}`);
      }

      if ((verifyToken as JwtPayload).role !== Role.ADMIN || Role.SUPERADMIN) {
        throw new AppError(403, "You are not permitted to view this route");
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  UserControllers.getAllUsers
);

export const UserRoutes = router;
