import User from '../models/user.model'
import Conversation from '../models/conversation.model'
import { Request, Response } from 'express'

export const getUsersForSideBar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.userId
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      '-password'
    )
    const directConversations = await Promise.all(
      users.map(async (user) => {
        let conversation
        conversation = await Conversation.findOne({
          isGroup: false,
          participants: {
            $size: 2,
            $all: [loggedInUserId, user._id],
          },
        })
        if (!conversation) {
          conversation = await Conversation.create({
            participants: [loggedInUserId, user._id],
          })
        }

        return { receiver: user, conversation }
      })
    )
    res.status(200).json(directConversations)
  } catch (error) {
    console.error('error in getUsersForSideBar controller', error)
    res.status(500).json({ message: error.message })
  }
}
