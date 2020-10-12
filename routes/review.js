const router = require('express').Router();
const Review = require('../models/Review');
const User = require('../models/User');
const passport = require('passport');

router.route('/')
  // get all reviews
  .get(async (req, res) => {
    const reviews = await Review.find({}).sort({ created_at: -1 }).populate('author')
    res.json(reviews)
  })
  .post(passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { title, rating, content, element, element_type } = req.body
      const review = new Review({ title, content, rating, element, element_type, author: req.user._id })
      await review.save()
      res.sendStatus(201)
    } catch (error) {
      res.sendStatus(400)
    }
    
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
