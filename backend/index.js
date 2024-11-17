import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
import conversationRoutes from './routes/conversation.routes.js'
import connectToMongoDB from './db/connectToMongoDB.js'
import cookieParser from 'cookie-parser'
import { app, server } from './socket/socket.js'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec from './utils/swagger.js'

dotenv.config()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)
app.use('/api/groups', conversationRoutes)

server.listen(PORT, () => {
  connectToMongoDB()
  console.log(`server is running on port ${PORT}`)
})