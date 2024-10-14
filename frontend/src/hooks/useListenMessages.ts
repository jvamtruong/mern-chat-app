import { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext'
import notificationSound from '../assets/sounds/notification.mp3'
import { useQueryClient } from '@tanstack/react-query'

const useListenMessages = (selectedConversation: DirectConversation | Conversation | null) => {
  const socketContext = useSocketContext()
  const socket = socketContext?.socket

  const queryClient = useQueryClient()

  useEffect(() => {
    socket?.on('newMessage', (data: any) => {
      data.shouldShake = true
      const sound = new Audio(notificationSound)
      sound.play()

      if (selectedConversation?.kind === 'DirectConversation') {
        if (data.conversationId === selectedConversation.conversation._id) {
          queryClient.setQueryData(
            ['messages', 'direct', selectedConversation?.receiver?._id],
            (oldMessages: any) => {
              return [...oldMessages, data.newMessage]
            }
          )
        }
      } else {
        if (data.conversationId === selectedConversation?._id) {
          queryClient.setQueryData(
            ['messages', 'group', selectedConversation?._id],
            (oldMessages: any) => {
              return [...oldMessages, data.newMessage]
            }
          )
        }
      }
    })

    return () => {
      socket?.removeAllListeners('newMessage')
    }
  }, [socket])
}

export default useListenMessages