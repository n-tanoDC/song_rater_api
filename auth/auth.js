const JWTStrategy = require('passport-jwt').Strategy;
const User = require('../models/User');
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const { bodyValidator } = require('../functions');
const localStrategy = require('passport-local').Strategy;

passport.use('signup', new localStrategy({ passReqToCallback: true },
  async (req, username, password, done) => {
    try {
      const body = { username, email: req.body.email, password }
      const { error } = await bodyValidator(body);

      if (error) {
        return done(error, null)
      }

      const user = await User.create(body)
      
      return done(null, user)

    } catch (error) {
      return done(error)
    }
  }
))


passport.use('login', new localStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username })

      if (!user) {
        return done(null, false)
      }

      const validate = await user.isValidPassword(password)

      if (!validate) {
        return done(null, false)
      }

      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }
))

passport.use(new JWTStrategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, 
  (payload, done) => {
    User.findById(payload.user._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user){
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }
));

exports.checkAuth = passport.authenticate('jwt', { session: false })
