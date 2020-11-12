const router = require('express').Router();

const Review = require('../models/Review');

const { findWithPagination, reviewValidator, authenticate } = require('../functions');

router.route('/')
  // get all reviews with pagination
  .get(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const reviews = await findWithPagination(Review, {}, page, limit);
    res.json(reviews)
  })
  
  .post(authenticate, async (req, res) => {
    try {
      const { body, user } = req;
      
      const { error } = await reviewValidator(body, user)

      if (error) {
        return res.status(400).json({ error });
      }
      
      const review = new Review({ ...body, author: user._id })
      await review.save().then(review => review.populate({ path: 'author', select: 'username avatar' }).execPopulate())

      res.status(201).json(review)
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
    
  })

router.route('/media/:id')
  // get all reviews for one media
  .get(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const { id } = req.params;
    const query = { 'media.id': id };
    const reviews = await findWithPagination(Review, query, page, limit)
    res.json(reviews)
  })

module.exports = router;
