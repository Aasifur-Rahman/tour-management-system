import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// this is higher order function
export const catchAsync =
  (fn: AsyncHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      next(err);
    });
  };
