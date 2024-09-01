import { useEffect } from 'react'
import Conversation from './Conversation'
import useStore from '../../zustand/store'
import { useSocketContext } from '../../context/SocketContext'

const Conversations = ({ isLoading }) => {
  console.log('Conversations')
  console.log('isLoading', isLoading)

  const { socket } = useSocketContext()
  const { conversations, setConversations } = useStore()

  console.log('conversations', conversations)

  useEffect(() => {
    console.log('Conversations effect')
    socket?.on('latestConversation', (conversation) => {
      console.log('latestConversation socket')
      if (conversations.length) {
        const newConversations = conversations.map((c) => {
          if (c?.conversation?._id === conversation?._id || c?._id === conversation?._id) {
            return { 
              ...c, 
              conversation 
            }
          }
          return c
        })
        newConversations.sort((a, b) => {
          return (
            new Date(b?.conversation?.updatedAt || b?.updatedAt) -
            new Date(a?.conversation?.updatedAt || a?.updatedAt)
          )
        })
        console.log('newConversations', newConversations)
        setConversations(newConversations)
      }
    })

    return () => socket?.removeAllListeners('latestConversation')
  }, [socket, conversations])

  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation?._id || conversation?.user?._id}
          conversation={conversation}
          lastIdx={idx === conversations.length - 1}
        />
      ))}

      {isLoading ? (
        <span className='loading loading-spinner mx-auto'></span>
      ) : null}
    </div>
  )
}

export default Conversations
