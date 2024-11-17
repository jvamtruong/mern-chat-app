import express from 'express'
import { sendMessage, getMessages } from '../controllers/message.controller.js'
import protectRoute from '../middleware/protectRoute.js'
import { markMessagesAsSeen } from '../controllers/message.controller.js'

const router = express.Router()

router.post('/send/:id', protectRoute, sendMessage)
router.get('/:type/:id', protectRoute, getMessages)
router.patch('/mark-as-seen', protectRoute, markMessagesAsSeen)

export default router