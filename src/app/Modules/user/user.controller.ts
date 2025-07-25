import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserServices.createUser(req.body);

    res.status(StatusCodes.CREATED).json({
      message: "User Created Successfully",
      user,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const UserControllers = { createUser };
