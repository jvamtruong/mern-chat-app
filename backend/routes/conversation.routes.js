import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import {
  addMemberToGroup,
  createGroup,
  getGroupChats,
  getUnseenMessages,
} from '../controllers/conversation.controller.js'

const router = express.Router()

router.get('/', protectRoute, getGroupChats)
router.post('/create', protectRoute, createGroup)
router.patch('/add-members/:group_id', protectRoute, addMemberToGroup)
router.get('/unseen/:sender_id', protectRoute, getUnseenMessages)

export default router