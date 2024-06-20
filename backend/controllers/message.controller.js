import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    })

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message
    })

    conversation.messages.push(newMessage._id)
    

    // await conversation.save()
		// await newMessage.save()

    await Promise.all([conversation.save(), newMessage.save()]) // run in parrellel

    res.status(201).json(newMessage)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params // string
    const senderId = req.user._id // ObjectId 

    //if (userToChatId == senderId) return res.status(400).json({ msg: 'cannot send messages to yourself' })
    if (userToChatId === senderId.toString())  {
      return res.status(400).json({ msg: 'cannot send messages to yourself' })
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] }
    }).populate('messages')

    if (!conversation) return res.status(200).json([])
    
    const messages = conversation.messages

    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}