import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../Modules/user/user.model";
import { Role } from "../Modules/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      // validating business logic here
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          return done(null, false, { message: "User does not exist" });
        }

        // if (!isUserExist) {
        //   return done("User does not exist");
        // }

        // checking it's google or not
        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider === "google"
        );

        if (isGoogleAuthenticated) {
          return done(null, false, {
            message:
              "You have authenticated through Google. If you want to login with credentials. then at first login with google and set a password and your gmail and then you can login with email and password",
          });
        }

        // password hashing
        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

// google
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("Google Strategy Error", error);
        return done(error);
      }
    }
  )
);

/* 
frontend localhost:5173 -> localhost:5000/api/v1/auth/google ->
 passport -> google oAuth consent -> gmail login -> successful ->
callback URL: localhost:5000/api/v1/auth/google/callback -> db store
-> provide token
*/

// Bridge === Google -> if not exist (user stored in db) else  -> token
//custom -> email, password, name ... role: USER -> registration -> DB -> 1 user created
// Google -> req -> google -> successful : jwt token: Role, email  -> DB - Store -> token - api access
// to let google know what will be the role of the email then in our db we have to store that user so we will know that google will be signed in the database

// serializing the session

passport.serializeUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    done(error);
  }
});
