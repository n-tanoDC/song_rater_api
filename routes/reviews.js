const router = require('express').Router();

const { checkAuth } = require('../auth/auth');

const controller = require('../controllers/reviewController');

/**
 * @swagger
 *  /reviews:
 *    get:
 *      summary: Retrieve a list of reviews
 *      responses:
 *        200:
 *          description: Return a list of reviews and the next page number if there is one
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  reviews:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Review'
 *                  next:
 *                    type: integer
 *    post:
 *      summary: Create a new review
 *      security:
 *        -bearer: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title: 
 *                  type: string
 *                  description: The title of the review
 *                  example: Great song !
 *                content:
 *                  type: string
 *                  description: The content of the review
 *                  example: I really love that song because [...]
 *                rating:
 *                  type: integer
 *                  description: The rating given to the content
 *                  example: 5
 *      responses:
 *        201:
 *          description: Return the created review
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Review'
 *        401:
 *          $ref: '#/components/responses/UnauthorizedError'
 *                
 */
router.route('/')
  .get(controller.getAllReviews)
  .post(checkAuth, controller.createReview)

  
router.route('/random')
  .get(controller.getRandomReviews)


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
