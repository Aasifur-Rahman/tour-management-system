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
        // add this to verify the multer uploads to get data our from the string and pass it as object or it will throw zod error
        // req.body = JSON.parse(req.body.data) || req.body;
        if (req.body.data) {
          req.body = JSON.parse(req.body.data);
        }
        req.body = await zodSchema.parseAsync(req.body);
        next();
      } catch (error) {
        next(error);
      }
    };
