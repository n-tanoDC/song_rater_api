const router = require('express').Router();
const Review = require('../models/Review');
const User = require('../models/User');

router.route('/')
  // get all reviews
  .get(async (req, res) => {
    const reviews = await Review.find({}).populate('author')
    res.json(reviews)
  })
  .post(async (req, res) => {
    const { title, rating } = req.body
    const review = new Review({
      title: title,
      rating: rating
    })
    await review.save()
    res.send('POST OK')
  })

router.route('/:id')
  // get one review
  .get(async (req, res) => {
    const { id } = req.params; 
    const review = await Review.findById(id);
    res.json(review);
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id)
    res.send('DELETE OK')
  })

module.exports = router;
