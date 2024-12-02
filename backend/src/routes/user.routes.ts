import express from 'express'
import protectRoute from '../middleware/protectRoute'
import { getUsersForSideBar } from '../controllers/user.controller'

const router = express.Router()

router.get('/', protectRoute, getUsersForSideBar)

export default router