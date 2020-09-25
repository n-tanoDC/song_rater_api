const router = require('express').Router();

const userRoutes = require('./user');
const reviewRoutes = require('./review');
const listRoutes = require('./list');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use('/user', userRoutes)
router.use('/review', reviewRoutes)
router.use('/list', listRoutes)

module.exports = router;
