import { asl } from "@/asl";
import { UserModel, withoutPassword } from "@/database";
import { UnauthenticatedError } from "@/utils";
import { Handler } from "express";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export const useJwtStrategy = () => {
  const strategy = new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (payload, done) => {
      UserModel.findOne({ _id: payload.id }, withoutPassword)
        .then((user) => {
          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        })
        .catch((error) => {
          done(error, false);
        });
    },
  );

  passport.use(strategy);
};

export const passportJwtApiMiddleware: () => Handler = () => {
  return function (req, res, next) {
    passport.authenticate(
      "jwt",
      { session: false },
      function callback(err?: Error, user?: Express.User) {
        if (err || !user) {
          return next(new UnauthenticatedError(err?.message));
        }

        const store = asl.getStore() as any;
        store.user = user;

        req.user = user;
        next();
      },
    )(req, res, next);
  };
};
