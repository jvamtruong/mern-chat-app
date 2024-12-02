import express from 'express'
import {
  login,
  logout,
  signup,
  getCurrentUser,
} from '../controllers/auth.controller'
import protectRoute from '../middleware/protectRoute'

const router = express.Router()

/**
 * @swagger
 * /api/auth/signup:
 *  post:
 *    summary: signup
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                description: username
 *              password:
 *                type: string
 *                description: password
 *    responses:
 *      201:
 *
 */
router.post('/signup', signup)

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: login
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                description: username
 *              password:
 *                type: string
 *                description: password
 *
 *    responses:
 *      200:
 *        description: success
 *      400:
 *        description: invalid username or password
 *      500:
 *        description: server error
 *
 *
 */
router.post('/login', login)

/**
 * @swagger
 * /api/auth/logout:
 *  post:
 *    summary: Logout current user
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: Successfully logged out
 *      401:
 *        description: Unauthorized - Invalid or missing JWT token
 *      404:
 *        description: User not found
 *      500:
 *        description: Server error
 */
router.post('/logout', protectRoute, logout)
router.get('/me', protectRoute, getCurrentUser)

export default router
