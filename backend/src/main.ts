import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import messageRoutes from './routes/message.routes'
import userRoutes from './routes/user.routes'
import conversationRoutes from './routes/conversation.routes'
import connectToMongoDB from './db/connectToMongoDB'
import cookieParser from 'cookie-parser'
import { app, server } from './socket/socket'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec from './utils/swagger'

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