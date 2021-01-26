/**
 * @swagger
 *  /auth/login:
 *    post:
 *      summary: Log in and retrieve authorization token
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *          description: Return the connected user's data and JWT token
 *          content:
 *            application/json:
 *              type: object
 *              properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 */

const router = require('express').Router();
const controller = require('../controllers/authController');

router.post('/signup', controller.signup);

router.post('/login', controller.login)

module.exports = router;

