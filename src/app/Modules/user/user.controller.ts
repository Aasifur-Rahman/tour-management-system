import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync =
  (fn: AsyncHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      next(err);
    });
  };

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
const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);

  res.status(StatusCodes.CREATED).json({
    message: "User Created Successfully",
    user,
  });
});

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserServices.getAllUsers();

    return users;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const UserControllers = { createUser, getAllUsers };
