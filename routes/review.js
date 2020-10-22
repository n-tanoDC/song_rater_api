const router = require('express').Router();
const Review = require('../models/Review');
const User = require('../models/User');
const { authenticate } = require('../auth/functions');

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
  .post(authenticate, async (req, res) => {
    try {
      const { title, rating, content, media } = req.body;
      const author = await User.findById(req.user._id);
      
      const oldReview = await Review.findOne({ author: author._id, 'media.id': media.id })
      
      if (oldReview) {
        throw new Error('Already exists');
      }
      
      const review = new Review({ title, content, rating, media, author })
      await review.save()
      res.status(201).json(review)
    } catch (error) {
      const code = error.message === 'Already exists' ? 409 : 400;
      res.status(code).json(error)
    }
    
  })

router.route('/media/:id')
  // get all reviews for one media
  .get(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const { id } = req.params;
    const reviews = await Review.find({ 'media.id': id})
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

module.exports = router;
