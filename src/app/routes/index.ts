import { Router } from "express";
import { UserRoutes } from "../Modules/user/user.route";

export const router = Router();

// this pattern is more compact and dynamic way to do this thing
const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
