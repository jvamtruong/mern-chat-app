import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

export const app = express()
export const server = http.createServer(app)
export const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'development'
        ? process.env.CLIENT_URL_DEV
        : process.env.CLIENT_URL_PROD,
    methods: ['GET', 'POST', 'PATCH'],
  },
})

const userSocketMap = new Map<string, string[]>()

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap.get(receiverId)
}

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)

  const userId = socket.handshake.query.userId as string

  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, [])
  }

  // more than one tab connected to the same account
  if (userId) {
    userSocketMap.get(userId).push(socket.id)
  }

  // io.emit() is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id)
    const disconnectedSocketId = userSocketMap
      .get(userId)
      .findIndex((socketId) => socketId === socket.id)
    userSocketMap.get(userId)[disconnectedSocketId] = '-1' // the socket is disconnected
    const total = userSocketMap
      .get(userId)
      .reduce((acc: number, socketId: string) => {
        if (socketId === '-1') {
          acc++
        }
        return acc
      }, 0)
    // console.log(`total: ${total} length: ${userSocketMap[userId].length}`)
    if (total === userSocketMap.get(userId).length) {
      userSocketMap.delete(userId) // remove userId from the map if all the sockets are disconnected
    }
    // console.log(userSocketMap)
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})
