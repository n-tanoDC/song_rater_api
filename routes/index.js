const express = require('express');
const bodyParser = require('body-parser');

const reviewRoutes = require('./reviews');
const userRoutes = require('./users');
const authRoutes = require('./auth');

require('../auth/auth')

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use('/uploads', express.static('uploads'))

router.use('/reviews', reviewRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)

router.route('/')
  .get((req, res) => {
    res.send('Hello World')
  })

module.exports = router;