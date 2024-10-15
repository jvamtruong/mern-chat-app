import Conversation from '../models/conversation.model.js'

export const createGroup = async (req, res) => {
  try {
    const newGroup = await Conversation.create({
      participants: [req.user._id],
      isGroup: true,
      name: req.user.fullName + ', ',
    })
    res.status(201).json(newGroup)
  } catch (error) {
    console.error('error in createGroup controller:', error)
    res.status(500).json({ message: error.message })
  }
}

export const addMemberToGroup = async (req, res) => {
  try {
    const { group_id } = req.params
    const { participant_id } = req.body
    const conversation = await Conversation.findById(group_id)

    if (conversation.participants.includes(participant_id)) {
      return res
        .status(400)
        .json({ message: 'this member is already in this group' })
    }

    conversation.participants.push(participant_id)
    await conversation.save()
    await conversation.populate({ path: 'participants', select: '-password' })

    res.status(200).json(conversation)
  } catch (error) {
    console.error('error in addMemberToGroup controller:', error)
    res.status(500).json({ message: error.message })
  }
}

export const deleteMemberFromGroup = async (req, res) => {
  try {
    const { group_id, member_id } = req.params
    const conversation = await Conversation.findById(group_id)
    if (!conversation) {
      return res.status(404).json({ message: 'conversation not found' })
    }
    conversation.participants = conversation.participants.filter(
      (participant) => participant.toString() !== member_id
    )
    await conversation.save()
    await conversation.populate({ path: 'participants', select: '-password' })
    res.status(200).json(conversation)
  } catch (error) {
    console.error('error in deleteMemberFromGroup controller:', error)
    res.status(500).json({ message: error.message })
  }
}

export const getGroupChats = async (req, res) => {
  try {
    // only the members of the group can see these group conversations
    const conversations = await Conversation.find({
      isGroup: true,
      participants: { $all: [req.user._id] },
    })
      .populate('participants')
      .select('-password')
    res.status(200).json(conversations)
  } catch (error) {
    console.error('error in getGroupChats controller:', error)
    res.status(500).json({ message: error.message })
  }
}

export const getUnseenMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const conversation = await Conversation.findById(conversationId).populate('messages')
    if (!conversation) {
      return res.status(404).json({ message: 'conversation not found' })
    }
    const unseenMessages = []
    const messages = conversation?.messages
    for (let i = messages?.length - 1; i >= 0; i--) {
      if (
        messages[i].sender.toString() !== req.user._id.toString() &&
        messages[i].status === 'delivered'
      ) {
        unseenMessages.push(messages[i])
      } else break
    }
    res.status(200).json(unseenMessages)
  } catch (error) {
    console.error('error in getUnseenMessages controller:', error)
    res.status(500).json({ message: error.message })
  }
}
