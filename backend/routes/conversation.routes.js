import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { addMemberToGroup, createGroup, getGroupChats } from '../controllers/conversation.controller.js'

const router = express.Router()

router.get('/', protectRoute, getGroupChats)
router.post('/create', protectRoute, createGroup)
router.patch('/add-members/:group_id', protectRoute, addMemberToGroup)

export default router