import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUser, findUserBy } from "../models/user-models";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { IUser } from "../types";

export const authentication = (): void => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user: IUser | null = await findUser({ username, password });
        return user !== null ? done(null, user) : done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
  //needs to save user._id
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (id: string, done) => {
    const user = await findUserBy(id);
    done(null, user);
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
          const user = findUserBy(payload.sub);
          return user !== null ? done(user, null) : done(null, false);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};
