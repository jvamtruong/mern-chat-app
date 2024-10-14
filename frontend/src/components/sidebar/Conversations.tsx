import Conversation from './Conversation'
import { useSocketContext } from '../../context/SocketContext'
import { useEffect } from 'react'
import useStore from '../../zustand/store'

interface Props {
  conversations: (Conversation | DirectConversation)[]
  isLoading: boolean
}

const Conversations = ({ conversations, isLoading }: Props) => {
  const socket = useSocketContext()?.socket
  const { setConversations } = useStore()

  useEffect(() => {
    socket?.on('latestConversation', (conversation: any) => {
      if (conversations.length) {
        const updatedConvos = conversations.map((convo) => {
          if (
            convo.kind === 'DirectConversation' &&
            convo.conversation._id === conversation._id
          ) {
            return {
              ...convo,
              conversation: conversation as Conversation,
            }
          } else if (
            convo.kind === 'Conversation' &&
            convo._id === conversation._id
          ) {
            return {
              ...convo,
              updatedAt: conversation.updatedAt as string,
            }
          }
          return convo
        })
        updatedConvos.sort((a, b) => {
          let u: string
          let v: string

          if (a.kind === 'DirectConversation') {
            u = a.conversation.updatedAt
            v = b.kind === 'DirectConversation' ? b.conversation.updatedAt : b.updatedAt
          } else {
            u = a.updatedAt
            v = b.kind === 'DirectConversation' ? b.conversation.updatedAt : b.updatedAt
          }

          return new Date(v).getTime() - new Date(u).getTime()
        })
        setConversations(updatedConvos)
      }
    })

    return () => {
      socket?.removeAllListeners('latestConversation')
    }
  }, [socket, conversations])

  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {conversations.map((conversation, idx) => (
        <Conversation
          key={
            conversation.kind === 'Conversation'
              ? conversation._id
              : conversation.receiver._id
          }
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