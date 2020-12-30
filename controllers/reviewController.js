const Review = require('../models/Review');
const User = require('../models/User');
const Media = require('../models/Media');

const { findWithPagination, reviewValidator, getMedia } = require('../functions');

exports.upvote = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    review.upvote(req.user._id)
    res.json({ 
      upvotes: review.upvotes,
      downvotes: review.downvotes,
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}

exports.downvote = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    review.downvote(req.user._id)
    res.json({ 
      upvotes: review.upvotes,
      downvotes: review.downvotes,
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}

// Get all reviews
exports.getAllReviews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const reviews = await findWithPagination(Review, {}, page, limit);
  res.json(reviews)
};

// Get all reviews for one user
exports.getReviewsForOneUser = async (req, res) => {
  const { page = 1, limit = 5 } = req.query
  const { username } = req.params;
  const user = await User.findOne({ username });
  const reviews = await findWithPagination(Review, { author: user._id }, page, limit)
  res.json(reviews)
};

// Get all reviews for one media
exports.getReviewsForOneMedia = async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const media = await Media.findOne({ id: req.params.id })
  if (media) {
    const reviews = await findWithPagination(Review, { media: media._id }, page, limit);
    return res.json(reviews)
  } else {
    return res.json([])
  }
};

// Get all reviews for user's subscriptions
exports.getReviewsBySubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query
    const query = { author: { $in : req.user.following }}
    const reviews = await findWithPagination(Review, query, page, limit)
    res.json(reviews);
  } catch (error) {
    res.json(error);
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { body, user } = req;
    const { error } = await reviewValidator(body, user)

    if (error) {
      return res.status(400).json({ error });
    }

    const media = await getMedia(body.media);
    
    const review = new Review({ ...body, media: media._id, author: user._id })
    await review.save()
      .then(review => review.populate({ path: 'author', select: 'username avatar' })
        .populate({ path: 'media' })
        .execPopulate()
      )

    res.status(201).json(review)
  } catch (error) {
    res.json(error);
  }
};