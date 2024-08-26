import { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext'
import useStore from '../zustand/store'
import notificationSound from '../assets/sounds/notification.mp3'

const useListenMessages = (selectedConversation) => {
  const { socket } = useSocketContext()
  const { messages, setMessages } = useStore()

  useEffect(() => {
    console.log('Messages socket effect')
    socket?.on('newMessage', (newMessage) => {
      newMessage.shouldShake = true
      const sound = new Audio(notificationSound)
      sound.play()
      if (
        newMessage.senderId === selectedConversation?._id
      ) {
        setMessages([...messages, newMessage])
      }
    })
  }, [socket, messages])
}

export default useListenMessages