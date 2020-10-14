const router = require('express').Router();
const Review = require('../models/Review');
const passport = require('passport');

router.route('/')
  // get all reviews with pagination
  .get(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const reviews = await Review.find({})
      .populate('author')
      .sort({ created_at: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec()
      const count = await Review.countDocuments()
      // get total amount of pages possible with the limit defined in the request
      const totalPages = Math.ceil(count / limit)
      // generate a url for the next page if there's any page left
      const next = page < totalPages ? (parseInt(page) + 1) : null
    res.json({ reviews, next })
  })
  // post a review
  .post(passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { title, rating, content, element, element_type } = req.body
      const review = new Review({ title, content, rating, element, element_type, author: req.user._id })
      await review.save()
      res.status(201).json(review)
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
