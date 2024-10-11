import { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext'
import useStore from '../zustand/store'
import notificationSound from '../assets/sounds/notification.mp3'

const useListenMessages = (selectedConversation) => {
  console.log('useListenMessages')
  const { socket } = useSocketContext()
  const { messages, setMessages } = useStore()

  useEffect(() => {
    console.log('Messages socket effect')
    socket?.on('newMessage', (newMessage) => {
      console.log('newMessage')
      newMessage.shouldShake = true
      const sound = new Audio(notificationSound)
      sound.play()
      console.log('messages', messages)
      console.log('newMessage', newMessage)
      console.log('selectedConversation', selectedConversation)
      // if (
      //   newMessage.senderId === selectedConversation?._id ||
      //   selectedConversation?.participants?.some(
      //     (participant) => participant._id === newMessage.senderId
      //   )
      // ) {
      //   setMessages([...messages, newMessage])
      // }
      if (
        selectedConversation?.messages?.includes(newMessage) ||
        newMessage.senderId === selectedConversation?._id
      ) {
        setMessages([...messages, newMessage])
      }
    })

    return () => {
      socket?.removeAllListeners('newMessage')
    }
  }, [socket, messages])
}

export default useListenMessages