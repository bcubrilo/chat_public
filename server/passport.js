const passport = require("passport");
const { User } = require("./models");

const { Strategy, ExtractJwt } = require("passport-jwt");

const config = require("./config/appconfig");

var options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.authentication.jwtSecret
};

passport.use(
  "jwt",
  new Strategy(options, async (jwtPayload, done) => {
    try {
      const user = await User.findOne({
        where: {
          id: jwtPayload
        }
      });
      if (!user) {
        return done(new Error(), false);
      }
      return done(null, user);
    } catch (ex) {
      return done(ex, false);
    }
  })
);

module.exports = null;
