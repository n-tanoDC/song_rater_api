const User = require('../models/User');
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const validateData = (value, type) => {
  const patterns = {
    // regular email pattern, ex : address@mail.com.
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    // At least one number, one uppercase alphabetical, one lowercase and 8 characters min.
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    // 3 to 20 characters, no . or _ at the beginning or end.
    username: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
  }
  return (patterns[type]).test(value);
}

passport.use('signup', new localStrategy(
  {
    passReqToCallback: true
  },
  async (req, username, password, done) => {
    try {
      const { email } = req.body;
      const keys = { username, password }

      if (email) {
        keys.email = email;
      }
      
      for (let [key, value] of Object.entries(keys)) {
        if (!validateData(value, key)) {
          return done({ type: 'syntax', key }, null)
        }
      }

      const user = await User.create({ email, username, password })
      return done(null, user)
    } catch (err) {
      if (err.code === 11000) {
        return done({ type: 'duplicate', key: Object.keys(err.keyValue)[0] })
      }

      return done(err)
    }
  }
))

// required : error.errors

passport.use('login', new localStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username })

      if (!user) {
        return done(null, false)
      }

      const validate = user.isValidPassword(password)

      if (!validate) {
        return done(null, false)
      }

      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }
))

passport.use(new JWTstrategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token')
  },
  async (token, done) => {
    try {
      return done(null, token.user)
    } catch (error) {
      done(error)
    }
  }
))