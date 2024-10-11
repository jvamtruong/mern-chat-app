import { useEffect, useRef, RefObject } from 'react'
import MessageSkeleton from '../skeletons/MessageSkeleton'
import Message from './Message'
import useListenMessages from '../../hooks/useListenMessages'
import useStore from '../../zustand/store'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MESSAGE_URL } from '../../utils/constants'

const Messages = () => {
  // console.log('Messages')
  const { selectedConversation } = useStore()
  console.log(selectedConversation)

  const type =
    selectedConversation?.kind === 'DirectConversation' ? 'direct' : 'group'
  const id =
    selectedConversation?.kind === 'DirectConversation'
      ? selectedConversation.receiver._id
      : selectedConversation?._id

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', type, id],
    queryFn: async () => {
      try {
        const res = await axios.get<Message[]>(`${MESSAGE_URL}/${type}/${id}`)
        return res.data
      } catch (error: any) {
        console.error(error)
      }
    },
  })

  // useEffect(() => {
  //   if (data) {
  //     setMessages(data)
  //   }
  // }, [data])

  useListenMessages(selectedConversation)
  const lastMessageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    console.log('last effect', messages)
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [messages])

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {!isLoading &&
        (messages?.length ?? 0) > 0 &&
        messages?.map((message) => (
          <div
            key={message._id}
            ref={lastMessageRef as RefObject<HTMLDivElement>}
          >
            <Message message={message} />
          </div>
        ))}

      {isLoading &&
        [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!isLoading && messages?.length === 0 && (
        <p className='text-center'>Send a message to start the conversation</p>
      )}
    </div>
  )
}

export default Messages
