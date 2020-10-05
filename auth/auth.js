const User = require('../models/User');
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use('signup', new localStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, username, password, done) => {
    try {
      const { email } = req.body
      const user = await User.create({ username, password, email })
      return done(null, user)
    } catch (error) {
      done(error)
    }
  }
))

passport.use('login', new localStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username })

      if (!user) {
        return done(null, false, { message: 'Not found.' })
      }

      const validate = await user.isValidPassword(password)

      if (!validate) {
        return done(null, false, { message: 'Wrong password.' })
      }

      return done(null, user, { message: 'Logged in.' })
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