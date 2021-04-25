import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserById, findUserByUsername } from "../models/user-models";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { IUser } from "../types";
import { isVerifiedPass } from "./password";

export const authentication = (): void => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user: IUser | null = await findUserByUsername(username);
        if (user && isVerifiedPass(password, user?.password)) {
          return user !== null ? done(null, user) : done(null, false);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
  //needs to save user._id
  passport.serializeUser(async (user, done) => {
    console.log(user);
    try {
      return user !== null ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await findUserById(id);
      return user !== null ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error, false);
    }
  });
};

export const authorization = (): void => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "something secret",
        algorithms: ["RS256"],
      },
      async (payload, done) => {
        try {
          const user = findUserById(payload.sub);
          return user !== null ? done(user, null) : done(null, false);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};

export const verifyUser = passport.authenticate("jwt", {
  session: false,
});
