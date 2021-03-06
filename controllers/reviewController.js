const Review = require('../models/Review');
const User = require('../models/User');
const Media = require('../models/Media');

const { findWithPagination, reviewValidator, getMedia } = require('../functions');

exports.getRandomReviews = async (req, res) => {
  try {
    const reviews = await Review.aggregate([{ 
        $sample: { size: 5 }
      }, {
        $lookup: {
          from: 'media',
          localField: 'media',
          foreignField: '_id',
          as: 'media'
        }
      }, {
        $unwind: {
          path: '$media'
        }
      },{
        $lookup: {
          from: 'users',
          let: { 'author': '$author'},
          pipeline: [
            {
              $match: { $expr: { $eq: [ "$$author", "$_id" ]}}
            },{
              $lookup: {
                from: 'media',
                localField: 'favorites',
                foreignField: '_id',
                as: 'favorites'
              }
            },{
              $project: {
                password: 0,
                email: 0
              }
          }],
          as: 'author'
        }
      }, { 
        $unwind: {
          path: '$author'
        }
      }
    ])
    
    res.json(reviews)
  } catch (error) {
    console.log(error);
    res.json(error)
  }
}
exports.upvote = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    review.upvote(req.user._id)
    res.json({ 
      averageVote: review.averageVote,
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
    await review.downvote(req.user._id)
    res.json({ 
      averageVote: review.averageVote,
      upvotes: review.upvotes,
      downvotes: review.downvotes,
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}

// Get all reviews
exports.getAllReviews = async (req, res) => {
  const { page = 1, limit = 10, sortValue } = req.query
  const reviews = await findWithPagination(Review, {}, page, limit, sortValue);
  res.json(reviews)
};

// Get all reviews for one user
exports.getReviewsForOneUser = async (req, res) => {
  const { page = 1, limit = 5, sortValue } = req.query
  const { username } = req.params;
  const user = await User.findOne({ username });
  const reviews = await findWithPagination(Review, { author: user._id }, page, limit, sortValue)
  res.json(reviews)
};

// Get all reviews for one media
exports.getReviewsForOneMedia = async (req, res) => {
  const { page = 1, limit = 10, sortValue} = req.query
  const media = await Media.findOne({ id: req.params.id })
  if (media) {
    const reviews = await findWithPagination(Review, { media: media._id }, page, limit, sortValue);
    return res.json(reviews)
  } else {
    return res.json([])
  }
};

// Get all reviews for user's subscriptions
exports.getReviewsBySubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 5, sortValue } = req.query
    const query = { author: { $in : req.user.following }}
    const reviews = await findWithPagination(Review, query, page, limit, sortValue)
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
    res.status(500).json(error);
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      console.log('cant find');
      return res.status(404).json({ error: 'Critique introuvable' })
    }

    if (!req.user.equals(review.author._id)) {
      console.log('not allowed');
      return res.status(404).json({ error: 'Vous ne pouvez pas supprimer cette critique.' })
    }

    await review.deleteOne()
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ error })
  }
}