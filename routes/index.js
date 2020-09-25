const router = require('express').Router();

const userRoutes = require('./user');
const reviewRoutes = require('./review');
const listRoutes = require('./list');

router.use('/user', userRoutes)
router.use('/review', reviewRoutes)
router.use('/list', listRoutes)

module.exports = router;
