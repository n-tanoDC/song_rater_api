const JWTStrategy = require('passport-jwt').Strategy;
const User = require('../models/User');
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const { validator } = require('./functions');
const localStrategy = require('passport-local').Strategy;

passport.use('signup', new localStrategy(
  {
    passReqToCallback: true
  },
  async (req, username, password, done) => {
    try {
      const { email } = req.body;
      const keys = { username, email, password }
      
      for (let [key, value] of Object.entries(keys)) {
        if (!validator(value, key)) {
          return done({ type: 'syntax', key }, null)
        }
      }

      const user = await User.create(keys)
      
      return done(null, user)

    } catch (err) {
      if (err.code === 11000) {
        return done({ type: 'duplicate', key: Object.keys(err.keyValue)[0] })
      }
      return done(err)
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