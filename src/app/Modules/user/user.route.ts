import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);
// /api/v1/user/:id
// what is happening here with the checkAuth having spread object values ?
// => basically this object.value it will have the role which is value of array and by spreading we are getting what we needed
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

export const UserRoutes = router;
