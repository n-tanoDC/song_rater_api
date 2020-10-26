const JWTStrategy = require('passport-jwt').Strategy;
const User = require('../models/User');
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const { validator } = require('./functions');
const localStrategy = require('passport-local').Strategy;

// We create a new passport local strategy for creating an account. 
passport.use('signup', new localStrategy(
  {
    // allow to access other params than username and password
    passReqToCallback: true
  },
  async (req, username, password, done) => {
    try {
      const { email } = req.body;
      // Define the properties to be checked further in the function
      const keys = { username, email, password }
      
      // Loop to validate every property
      // => if a property is not valid, return an object with the type
      //    of the error and the key of the not-valid property
      for (let [key, value] of Object.entries(keys)) {
        if (!validator(value, key)) {
          return done({ type: 'syntax', key }, null)
        }
      }

      // If every property is valid, we try to create a new User with those properties
      const user = await User.create(keys)
      
      // When the User is created, return 
      //  => null (the first parameter is the error, if there's one)
      //  => user (the user we just created)
      return done(null, user)

    } catch (err) {
      // One of the most likely error is a duplicate so we return a specific error if that is the case
      // The code 11000 is returned by Mongoose when there's a duplicate
      // Mongoose also precises the field that created the error, in the keyValue property
      if (err.code === 11000) {
        return done({ type: 'duplicate', key: Object.keys(err.keyValue)[0] })
      }
      return done(err)
    }
  }
))

// We create a new passport local strategy for loggin in
passport.use('login', new localStrategy(
  async (username, password, done) => {
    try {
      // We try to find a user with the username provided
      const user = await User.findOne({ username })

      // If there's no user, return : 
      //  => null as there's no error.
      //  => false as there's no user with that username.
      if (!user) {
        return done(null, false)
      }

      // If we found a user, check his password.
      const validate = await user.isValidPassword(password)

      // If the password is not valid, return :
      //  => null, as there's still no error.
      //  => false, as the password is wrong. 
      if (!validate) {
        return done(null, false)
      }

      // If we reach this point, it means the username and
      // the password are correct so we return:
      //  => null, as there's still no error.
      //  => user, the data of the user logged in.
      return done(null, user)
    } catch (error) {
      // return the error catched in the trycatch
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