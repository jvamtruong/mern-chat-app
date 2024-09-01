import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'
import { getReceiverSocketId, io } from '../socket/socket.js'

export const sendMessage = async (req, res) => {
  try {
    const { message, msg_type } = req.body
    const { id } = req.params
    const senderId = req.user._id

    let newMessage, conversation
    if (msg_type === 'one-on-one') {
      conversation = await Conversation.findOne({
        group: false,
        participants: { $all: [senderId, id] },
      })
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, id],
        })
      }
      newMessage = new Message({
        senderId,
        receiverId: [id],
        message,
      })
    } else {
      conversation = await Conversation.findById(id)
      if (!conversation) {
        return res.status(404).json({ error: 'conversation not found' })
      }
      newMessage = new Message({
        senderId,
        receiverId: conversation.participants.filter(
          (participant) => participant.toString() !== senderId.toString()
        ),
        message,
      })
    }

    conversation.messages.push(newMessage._id)
    conversation.unseenMessages = ++conversation.unseenMessages
    await Promise.all([newMessage.save(), conversation.save()])

    // SOCKET IO FUNCTIONALITY GOES HERE

    if (msg_type === 'one-on-one') {
      const receiverSocketIds = getReceiverSocketId(id)
      if (receiverSocketIds) {
        // io.to(<socket_id>).emit() used to send events to specific client
        receiverSocketIds.forEach((socketId) => {
          io.to(socketId).emit('newMessage', newMessage)
          io.to(socketId).emit('unseenMessages', newMessage.senderId)
          io.to(socketId).emit('latestConversation', conversation)
        })
      }
    } else {
      const receiverSocketIds = conversation.participants.map(
        (participant) => getReceiverSocketId(participant.toString())
      )
      for (let i = 0; i < receiverSocketIds.length; i++) {
        if (receiverSocketIds[i]) {
          receiverSocketIds[i].forEach((socketId) => {
            io.to(socketId).emit('newMessage', newMessage)
          })
        }
      }
    }

    res.status(201).json(newMessage)
  } catch (error) {
    console.error('error in sendMessage controller', error)
    res.status(500).json({ error: error.message })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id, type } = req.params // string
    const senderId = req.user._id // ObjectId

    //if (userToChatId == senderId) return res.status(400).json({ msg: 'cannot send messages to yourself' })
    if (id === senderId.toString()) {
      return res.status(400).json({ error: 'cannot send messages to yourself' })
    }

    let conversation

    if (type === 'one-on-one') {
      conversation = await Conversation.findOne({
        group: false,
        participants: { $all: [senderId, id] },
      }).populate('messages')
    } else {
      conversation = await Conversation.findById(id).populate('messages')
    }

    if (!conversation) return res.status(200).json([])

    res.status(200).json(conversation.messages)
  } catch (error) {
    console.error('error in getMessages controller', error)
    res.status(500).json({ error: error.message })
  }
}
