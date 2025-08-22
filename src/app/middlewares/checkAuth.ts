import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No Token Recieved");
      }
      const verifiedToken: JwtPayload = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      // authRoles will get an array like that = ["ADMIN", "SUPER_ADMIN"]
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route");
      }

      // why we need to do this here?
      // => if we do that we don't need to get the token from the authorizations from req.headers and we don't need to use the verified token in the controller there we can instead use const verifiedToken = user.req in the controller
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
