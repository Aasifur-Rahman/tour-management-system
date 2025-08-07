import { Router } from "express";
import { UserRoutes } from "../Modules/user/user.route";
import { AuthRoutes } from "../Modules/auth/auth.route";

export const router = Router();

// this pattern is more compact and dynamic way to do this thing
const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
