const router = require('express').Router();
const Review = require('../models/Review');
const { authenticate } = require('../auth/functions');

router.route('/')
  // get all reviews with pagination
  .get(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const reviews = await Review.find({})
      .populate('author', '-password -email -created_at -isAdmin -__v')
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
  .post(authenticate, async (req, res) => {
    try {
      const { user, body } = req;
      // check if the user already posted a review on this specific content.
      // throw an Error if it is the case.
      const oldReview = await Review.findOne({ author: user._id, 'media.id': body.media.id })
      
      if (oldReview) {
        throw new Error('duplicate');
      }
      
      // create a new Review with the request informations and save it.
      const review = new Review({ ...body, author: user._id })
      await review.save()

      // send a status code 201 "Created", and the new review as JSON.
      res.status(201).json(review)
    } catch (error) {
      // send a different code according to the error message.
      const code = error.message === 'duplicate' ? 409 : 400;
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
