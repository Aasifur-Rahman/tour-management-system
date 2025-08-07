import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: " Logged in Successfully",
      data: loginInfo,
    });
  }
);

//user - login - gives token (email, role, _id) this is user identity - booking / payment / payment cancel - token
// for authenticity you need token

export const AuthControllers = {
  credentialsLogin,
};
