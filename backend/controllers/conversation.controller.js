import Conversation from "../models/conversation.model.js"

export const createGroup = async (req, res) => {
  try {
    const newGroup = await Conversation.create({
      participants: [req.user._id],
      group: true,
      name: req.user.fullName + ', '
    })
    res.status(201).json(newGroup)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const addMemberToGroup = async (req, res) => {
  try {
    const { group_id } = req.params
    const { participant_id } = req.body
    const conversation = await Conversation.findOne({ _id: group_id })

    if (conversation.participants.includes(participant_id)) {
      return res.status(400).json({ error: 'this member is already in this group' })
    }

    conversation.participants.push(participant_id)
    await conversation.save()
    await conversation.populate('participants', { password: 0 })
    
    res.status(201).json(conversation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getGroupChats = async (req, res) => {
  try {
    // only the members of the group can see these group conversations
    const conversations = await Conversation.find({ group: true, participants: { $all: [req.user._id] } })
                                            .populate('participants', { password: 0 })
    res.status(200).json(conversations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}