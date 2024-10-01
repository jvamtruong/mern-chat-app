import { useEffect, useRef } from 'react'
import useGetMessages from '../../hooks/useGetMessages'
import MessageSkeleton from '../skeletons/MessageSkeleton'
import Message from './Message'
import useListenMessages from '../../hooks/useListenMessages'
import useStore from '../../zustand/store'

const Messages = () => {
  console.log('RENDER')
  const { selectedConversation } = useStore()
  const { isFetching, messages } = useGetMessages(selectedConversation)
  console.log(selectedConversation.fullName)
  useListenMessages(selectedConversation)
  const lastMessageRef = useRef()

  useEffect(() => {
    console.log('last effect', messages)
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [messages])

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {!isFetching &&
        messages?.length > 0 &&
        messages?.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}

      {isFetching &&
        [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!isFetching && messages?.length === 0 && (
        <p className='text-center'>Send a message to start the conversation</p>
      )}
    </div>
  )
}

export default Messages
