import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);

// who will use this the person who logged in will use it
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logOut);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);
router.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword)
router.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword)
router.post("/forgot-password", AuthControllers.forgotPassword)



//  /booking -> /login -> successful google login -> /booking frontend
// /login -> successful google login -> /frontend
router.get(
  "/google",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

// api/v1/auth/google/callback?state=/booking
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControllers.googleCallBackController
);

export const AuthRoutes = router;
