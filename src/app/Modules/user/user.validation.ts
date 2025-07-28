// we will use zod in 2 times
// 1. when we will create data in database
// 2. When we will update the data in database
// so in this 2 case we use req.body that's why zod is needed

import { z } from "zod";

// in delete and read we don't use the body
export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name to short. Minimum 2 character long" })
    .max(50, { message: "Name too long" }),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email cannot exceed 100 characters" }),
  //   1 uppercase, 1 special character, 1 digit, 8 characters min
  password: z
    .string({ invalid_type_error: "Password must be string" })
    .min(8, { message: "8 characters minimum" })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 digit.",
    }),
  phone: z
    .string({ invalid_type_error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
});
