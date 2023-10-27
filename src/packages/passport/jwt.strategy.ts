import { UserModel, withoutPassword } from "@/database";
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
