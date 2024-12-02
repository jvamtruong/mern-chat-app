interface User {
  _id: string
  fullName: string
  username: string
  password: string
  profilePic: string
  gender: string
  createdAt: string
  updatedAt: string
}

interface Message {
  _id: string
  sender: User 
  receivers: User[]
  message: string
  createdAt: string
  updatedAt: string
  shouldShake: boolean
}

interface Conversation {
  _id: string
  participants: User[]
  messages: Message[]
  isGroup: boolean
  name: string
  createdAt: string
  updatedAt: string
  kind: 'Conversation'
}

interface DirectConversation {
  receiver: User
  conversation: Conversation
  kind: 'DirectConversation'
}