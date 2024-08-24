import User from '../models/user.model.js'
import Conversation from '../models/conversation.model.js'

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password')
    const directConversations = await Promise.all(
      users.map(async (user) => {
        let conversation
        conversation = await Conversation.findOne({
          group: false,
          participants: {
            $size: 2,
            $all: [loggedInUserId, user._id]
          }
        })
        if (!conversation) {
          conversation = await Conversation.create({
            participants: [loggedInUserId, user._id]
          })
        }

        return { user, conversation }
      })
    )
    res.status(200).json(directConversations)
  } catch (error) {
    console.error('error in getUsersForSideBar controller', error)
    res.status(500).json({ error: error.message })
  }
}