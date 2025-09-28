import { Router } from "express";
import { UserRoutes } from "../Modules/user/user.route";
import { AuthRoutes } from "../Modules/auth/auth.route";
import { DivisionRoutes } from "../Modules/division/division.route";
import { TourRoutes } from "../Modules/tour/tour.route";

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
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
