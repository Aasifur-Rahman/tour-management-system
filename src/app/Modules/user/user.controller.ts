import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await UserServices.createUser(req.body);

//     res.status(StatusCodes.CREATED).json({
//       message: "User Created Successfully",
//       user,
//     });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     next(err);
//   }
// };
const createUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    res.status(StatusCodes.CREATED).json({
      message: "User Created Successfully",
      user,
    });
  }
);

const getAllUsers = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "All users Retrieved Successfully",
      users,
    });
  }
);

export const UserControllers = { createUser, getAllUsers };
