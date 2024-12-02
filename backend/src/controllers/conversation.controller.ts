import Conversation from '../models/conversation.model'
import { Request, Response } from 'express'
import User from '../models/user.model'
import mongoose from 'mongoose'

export const createGroup = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId)
    const newGroup = await Conversation.create({
      participants: [user._id],
      isGroup: true,
      name: user.fullName + ', ',
    })
    res.status(201).json(newGroup)
  } catch (error) {
    console.error('error in createGroup controller:', error)
    res.status(500).json({ message: error.message })
  }
}

export const addMemberToGroup = async (
  req: Request<{ group_id: string }, {}, { participant_id: string }>,
  res: Response
) => {
  try {
    const { group_id } = req.params
    const { participant_id } = req.body
    const conversation = await Conversation.findById(group_id)
    const participant_obj_id = new mongoose.Types.ObjectId(participant_id)

    if (conversation.participants.includes(participant_obj_id)) {
      res.status(400).json({ message: 'this member is already in this group' })
      return
    }

    conversation.participants.push(participant_obj_id)
    await conversation.save()
    await conversation.populate({ path: 'participants', select: '-password' })

    res.status(200).json(conversation)
  } catch (error) {
    console.error('error in addMemberToGroup controller:', error)
    res.status(500).json({ message: error.message })
  }
}

export const deleteMemberFromGroup = async (
  req: Request<{ group_id: string; member_id: string }>,
  res: Response
) => {
  try {
    const { group_id, member_id } = req.params
    const conversation = await Conversation.findById(group_id)
    if (!conversation) {
      res.status(404).json({ message: 'conversation not found' })
      return
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

export const getGroupChats = async (req: Request, res: Response) => {
  try {
    // only the members of the group can see these group conversations
    const conversations = await Conversation.find({
      isGroup: true,
      participants: { $all: [req.userId] },
    })
      .populate('participants')
      .select('-password')
    res.status(200).json(conversations)
  } catch (error) {
    console.error('error in getGroupChats controller:', error)
    res.status(500).json({ message: error.message })
  }
}

export const getUnseenMessages = async (
  req: Request<{ conversationId: string }>,
  res: Response
) => {
  try {
    const { conversationId } = req.params
    const conversation = await Conversation.findById(conversationId).populate(
      'messages'
    )
    if (!conversation) {
      res.status(404).json({ message: 'conversation not found' })
      return
    }
    const unseenMessages = []
    const messages: any = conversation?.messages
    for (let i = messages?.length - 1; i >= 0; i--) {
      if (
        messages[i].sender.toString() !== req.userId &&
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
