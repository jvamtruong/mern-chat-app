import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import {
  addMemberToGroup,
  createGroup,
  getGroupChats,
  getUnseenMessages,
  deleteMemberFromGroup,
} from '../controllers/conversation.controller.js'

const router = express.Router()

router.get('/', protectRoute, getGroupChats)
router.post('/create', protectRoute, createGroup)
router.patch('/add-members/:group_id', protectRoute, addMemberToGroup)
router.patch('/delete/:group_id/:member_id', protectRoute, deleteMemberFromGroup)
router.get('/notifications/:conversationId', protectRoute, getUnseenMessages)

export default router