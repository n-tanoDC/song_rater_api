const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');

router.post('/signup', (req, res, next) => {
  passport.authenticate('signup', (error, user) => {
    if (error) {
      // send 400 ('Bad request') and the error as json
      return res.status(400).json({ error })
    }

    if (!user) {
      // send 500 ('Internal server error') if there's no error and no user
      return res.sendStatus(500)
    }

    // if there's no error and a valid user, send 201 ('Created') and the user as json and generate a JWT token
    const { _id, username } = user;
    const token = jwt.sign({ user: { _id, username } }, process.env.JWT_SECRET);
    return res.status(201).json({ user, token });
  })(req, res, next)
});

router.post('/login', async(req, res, next) => {
  passport.authenticate('login', async (err, user) => {
    try {
      if (err || !user) {
        return err ? res.sendStatus(500) : res.sendStatus(401)
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error)
        const body = { _id: user._id, username: user.username }
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
        return res.status(200).json({ token, user });
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

module.exports = router;

