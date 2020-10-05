const router = require('express').Router();
const bodyParser = require('body-parser');
const passport = require('passport');

const reviewRoutes = require('./review');
const userRoutes = require('./user');
const authRoutes = require('./auth');

require('../auth/auth')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use('/review', reviewRoutes)
router.use('/auth', authRoutes)
router.use('/user', userRoutes)

module.exports = router;

//  passport.authenticate('jwt', { session: false }),
