// higher order function

import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  // here we are recieving schema of zod from validations file then we are making it parseAsync(req.body) to send the data


    (zodSchema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
      // what is this doing here in this schema
      // it's checking this schema does it have those data through the body
      try {
        req.body = await zodSchema.parseAsync(req.body);
        next();
      } catch (error) {
        next(error);
      }
    };
