const jwt = require('jsonwebtoken');
const passport = require('passport');


// Create a new user account
exports.signup = (req, res, next) => {
  passport.authenticate('signup', (error, user) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ error })
    }

    if (!user) {
      return res.sendStatus(500)
    }

    const { _id, username } = user;
    const token = jwt.sign({ user: { _id, username } }, process.env.JWT_SECRET);
    return res.status(201).json({ user, token });
  })(req, res, next)
}

// Generate a connection token after checking users credentials 
exports.login = (req, res, next) => {
  passport.authenticate('login', async (err, user) => {
    try {

      if (err) {
        return res.sendStatus(500)
      }

      if (!user) {
        return res.status(401).json({ error: 'Identifiants incorrects.' })
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error) 
        }

        const body = { _id: user._id, username: user.username }

        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

        return res.status(200).json({ token, user });
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
}