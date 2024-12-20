import { useState, useEffect } from 'react'
import { useSocketContext } from '../../context/SocketContext'
import notificationSound from '../../assets/sounds/notification.mp3'
import useStore from '../../zustand/store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { CONVERSATION_URL, MESSAGE_URL } from '../../utils/constants'

interface Props {
  conversation: Conversation | DirectConversation
  isLastIdx: boolean
}

const Conversation = ({ conversation, isLastIdx }: Props) => {
  const { selectedConversation, setSelectedConversation } = useStore()
  const selectedConversationId =
    selectedConversation?.kind === 'DirectConversation'
      ? selectedConversation.receiver._id
      : selectedConversation?._id
  const isSelected =
    selectedConversationId ===
    (conversation.kind === 'DirectConversation'
      ? conversation.receiver._id
      : conversation._id)
  const socketContext = useSocketContext()
  const socket = socketContext?.socket
  const onlineUsers = socketContext?.onlineUsers

  const isOnline = onlineUsers?.includes(
    (conversation as DirectConversation)?.receiver?._id
  )
  // const [unseenMessages, setUnseenMessages] = useState(0)
  const conversationId =
    conversation.kind === 'DirectConversation'
      ? conversation.conversation._id
      : conversation._id

  const queryClient = useQueryClient()

  const { data: unseenMessages } = useQuery({
    queryKey: ['notifications', conversationId],
    queryFn: async () => {
      const res = await axios.get<Message[]>(
        `${CONVERSATION_URL}/notifications/${conversationId}`
      )
      return res.data
    },
  })

  const { mutate: markAsSeen } = useMutation({
    mutationFn: (data: Message[] | undefined) =>
      axios.patch(`${MESSAGE_URL}/mark-as-seen`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', conversationId],
      })
    },
    onError: (error: any) => {
      console.error(error.response.data.message)
    },
  })

  useEffect(() => {
    socket?.on(
      'unseenMessages',
      (data: { newMessage: Message; conversationId: string }) => {
        if (conversationId === data.conversationId) {
          const sound = new Audio(notificationSound)
          sound.play()
          queryClient.setQueryData(
            ['notifications', conversationId],
            (oldData: Message[]) => {
              return [...oldData, data.newMessage]
            }
          )
        }
      }
    )

    return () => {
      socket?.removeAllListeners('unseenMessages')
    }
  }, [socket])

  return (
    <>
      <div
        className={`flex justify-between gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
				${isSelected ? 'bg-sky-500' : ''}
			`}
        onClick={() => {
          setSelectedConversation(conversation)
          if (unseenMessages?.length) {
            markAsSeen(unseenMessages)
          }
        }}
      >
        <div className='flex justify-center items-center gap-1'>
          <div className={`avatar ${isOnline ? 'online' : ''}`}>
            <div className='w-12 rounded-full'>
              <img src={conversation?.receiver?.profilePic} alt='user avatar' />
            </div>
          </div>
          {conversation.kind === 'DirectConversation' && (
            <p className='font-bold text-gray-200'>
              {conversation?.receiver?.fullName}
            </p>
          )}
        </div>

        <p className='text-base text-red-600 font-semibold'>
          {unseenMessages?.length ? unseenMessages?.length : ''}
        </p>
      </div>

      {!isLastIdx && <div className='divider my-0 py-0 h-1' />}
    </>
  )
}

export default Conversation
