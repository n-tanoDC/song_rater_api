const router = require('express').Router();

const { checkAuth } = require('../auth/auth');

const controller = require('../controllers/reviewController');


router.route('/')
  .get(controller.getAllReviews)
  .post(checkAuth, controller.createReview)

router.route('/upvote/:id')
  .get(checkAuth, controller.upvote)

router.route('/downvote/:id')
  .get(checkAuth, controller.downvote)

router.route('/subscriptions')
  .get(checkAuth, controller.getReviewsBySubscriptions)

router.route('/media/:id')
  .get(controller.getReviewsForOneMedia)

router.route('/:username')
  .get(controller.getReviewsForOneUser)


module.exports = router;
