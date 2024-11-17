import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'
import { getReceiverSocketId, io } from '../socket/socket.js'

export const sendMessage = async (req, res) => {
  try {
    const { message, msg_type } = req.body
    const { id } = req.params
    const senderId = req.user._id

    let newMessage, conversation, realTimeMessage
    if (msg_type === 'direct') {
      conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [senderId, id] },
      })
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, id],
        })
      }
      newMessage = new Message({
        sender: senderId,
        receivers: [id],
        message,
      })
      realTimeMessage = {
        newMessage,
        conversationId: conversation._id,
      }
    } else {
      conversation = await Conversation.findById(id)
      if (!conversation) {
        return res.status(404).json({ message: 'conversation not found' })
      }
      newMessage = new Message({
        sender: senderId,
        receivers: conversation.participants.filter(
          (participant) => participant.toString() !== senderId.toString()
        ),
        message,
      })
      realTimeMessage = {
        newMessage,
        conversationId: conversation._id,
      }
    }

    conversation.messages.push(newMessage._id)
    await Promise.all([newMessage.save(), conversation.save()])

    // SOCKET IO FUNCTIONALITY GOES HERE

    if (msg_type === 'direct') {
      const receiverSocketIds = getReceiverSocketId(id)
      if (receiverSocketIds) {
        // io.to(<socket_id>).emit() used to send events to specific client
        receiverSocketIds.forEach((socketId) => {
          io.to(socketId).emit('newMessage', realTimeMessage)
          io.to(socketId).emit('unseenMessages', realTimeMessage)
          io.to(socketId).emit('latestConversation', conversation)
        })
      }
    } else {
      const receiverSocketIds = conversation.participants
        .filter((participant) => participant.toString() !== senderId.toString())
        .map((participant) => getReceiverSocketId(participant.toString()))
        
      receiverSocketIds.forEach((receiverSocketId) => {
        if (receiverSocketId) {
          receiverSocketId.forEach((socketId) => {
            io.to(socketId).emit('newMessage', realTimeMessage)
            io.to(socketId).emit('unseenMessages', realTimeMessage)
            io.to(socketId).emit('latestConversation', conversation)
          })
        }
      })
    }

    res.status(201).json(newMessage)
  } catch (error) {
    console.error('error in sendMessage controller', error)
    res.status(500).json({ message: error.message })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id, type } = req.params // string
    const senderId = req.user._id // ObjectId

    //if (userToChatId == senderId) return res.status(400).json({ msg: 'cannot send messages to yourself' })
    if (id === senderId.toString()) {
      return res
        .status(400)
        .json({ message: 'cannot send messages to yourself' })
    }

    let conversation

    if (type === 'direct') {
      conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [senderId, id] },
      }).populate({
        path: 'messages',
        populate: { path: 'sender' },
      })
    } else {
      conversation = await Conversation.findById(id).populate({
        path: 'messages',
        populate: { path: 'sender' },
      })
    }

    if (!conversation) return res.status(200).json([])

    res.status(200).json(conversation.messages)
  } catch (error) {
    console.error('error in getMessages controller', error)
    res.status(500).json({ message: error.message })
  }
}

export const markMessagesAsSeen = async (req, res) => {
  try {
    const unseenMessages = req.body
    const unseenMessagesIds = unseenMessages.map((message) => message._id)
    const messages = await Message.find({
      _id: { $in: unseenMessagesIds },
    })
    await Promise.all(
      messages.map((message) => {
        message.status = 'seen'
        return message.save()
      })
    )
    res.status(200).json({ message: 'messages marked as seen' })
  } catch (error) {
    console.error('error in markMessagesAsSeen controller', error)
    res.status(500).json({ message: error.message })
  }
}
