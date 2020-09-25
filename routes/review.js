const router = require('express').Router();
const Review = require('../models/Review')

router.route('/')
  .get(async (req, res) => {
    const reviews = await Review.find({}).populate('author')
    res.json(reviews)
  })

module.exports = router;
