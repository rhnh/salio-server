import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUser, findUserBy } from "../models/user-models";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

export const authentication = (): void => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await findUser({ username, password });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );
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
