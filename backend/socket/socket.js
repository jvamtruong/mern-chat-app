import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST", "PATCH"]
	}
})

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId]
}

const userSocketMap = {} // { userId: socketId }

io.on("connection", (socket) => {
	console.log("a user connected", socket.id)

	const userId = socket.handshake.query.userId

  if (!userSocketMap.hasOwnProperty(userId)) {
		userSocketMap[userId] = []
	}

  // more than one tab connected to the same account
  if (userId != 'undefined') {
		userSocketMap[userId].push(socket.id)
	}

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap))

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id)
		delete userSocketMap[userId].findIndex((socketId) => socketId === socket.id)
    const total = userSocketMap[userId].reduce((acc, socketId) => {
        if (socketId === undefined) {
          acc++
        }
        return acc
    }, 0)
    if (total === userSocketMap[userId].length) {
      delete userSocketMap[userId]
    }
		io.emit("getOnlineUsers", Object.keys(userSocketMap))
	})
})

export { app, io, server }