const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const reviewRoutes = require('./review');
const userRoutes = require('./user');
const authRoutes = require('./auth');

require('../auth/auth')

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use('/uploads', express.static('uploads'))

router.use('/reviews', reviewRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)

module.exports = router;

//  passport.authenticate('jwt', { session: false }),
