/**
 * @swagger
 *  components:
 *    responses:
 *      UnauthorizedError:
 *        description: JWT token is missing or invalid
 *    securitySchemes:
 *      bearer:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    schemas:
 *      Review:
 *        type: object
 *        required:
 *          - rating
 *        properties:
 *          title:
 *            type: string
 *            minLength: 5
 *            maxLength: 70
 *          content:
 *            type: string
 *            minLength: 10
 *            maxLength: 5000
 *          media:
 *            $ref: '#/components/schemas/Media'
 *          created_at:
 *            type: string
 *            format: date
 *          rating:
 *            type: integer
 *          upvotes: 
 *            type: array
 *            items: 
 *              $ref: '#/components/schemas/User'
 *          downvotes: 
 *            type: array
 *            items: 
 *              $ref: '#/components/schemas/User'
 *          author: 
 *            $ref: '#/components/schemas/User'
 *      User:
 *        type: object
 *        required: 
 *          - username
 *          - email
 *          - password
 *        properties:
 *          avatar:
 *            type: string
 *            description: User's profile picture
 *          username:
 *            type: string
 *          email:
 *            type: string
 *          favorites:
 *            $ref: '#/components/schemas/Media'
 *          password: 
 *            type: string
 *          created_at:
 *            type: string
 *            format: date
 *          followers: 
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/User'
 *          following: 
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/User'
 *          isAdmin:
 *            type: boolean
 *      Media:
 *        type: object
 *        required: 
 *          - id
 *          - link
 *          - media_type
 *          - name
 *        properties:
 *          id:
 *            type: string
 *          link:
 *            type: string
 *          media_type:
 *            type: string
 *            enum: ['track', 'album', 'artist']
 *          name:
 *            type: string
 *          average_rating:
 *            type: number
 *          artists: 
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                name:
 *                  type: string
 *          image:
 *            type: string
 */

const express = require('express');
const bodyParser = require('body-parser');

const reviewRoutes = require('./reviews');
const userRoutes = require('./users');
const authRoutes = require('./auth');

require('../auth/auth')

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use('/uploads', express.static('uploads'))

router.use('/reviews', reviewRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)

router.route('/')
  .get((req, res) => {
    res.send('Hello World')
  })

module.exports = router;