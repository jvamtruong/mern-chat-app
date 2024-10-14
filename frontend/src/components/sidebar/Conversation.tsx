import { useState, useEffect } from 'react'
import { useSocketContext } from '../../context/SocketContext'
import notificationSound from '../../assets/sounds/notification.mp3'
import useStore from '../../zustand/store'

interface Props {
  conversation: Conversation | DirectConversation
  lastIdx: boolean
}

const Conversation = ({ conversation, lastIdx }: Props) => {
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
  const [unseenMessages, setUnseenMessages] = useState(0)

  useEffect(() => {
    socket?.on('unseenMessages', (senderId: string) => {
      if (senderId === conversation?.receiver?._id) {
        const sound = new Audio(notificationSound)
        sound.play()
        setUnseenMessages((prev) => prev + 1)
      }
    })

    return () => {
      socket?.removeAllListeners('unseenMessages')
    }
  }, [socket])

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
				${isSelected ? 'bg-sky-500' : ''}
			`}
        onClick={() => {
          setSelectedConversation(conversation)
          setUnseenMessages(0)
        }}
      >
        <div className={`avatar ${isOnline ? 'online' : ''}`}>
          <div className='w-12 rounded-full'>
            <img src={conversation?.receiver?.profilePic} alt='user avatar' />
          </div>
        </div>

        <div className='flex flex-col flex-1'>
          <div className='flex gap-3 justify-between'>
            {conversation.kind === 'DirectConversation' && (
              <p className='font-bold text-gray-200'>
                {conversation?.receiver?.fullName}
              </p>
            )}
            <span className='text-base text-red-600 font-semibold'>
              {unseenMessages ? unseenMessages : ''}
            </span>
          </div>
        </div>
      </div>

      {!lastIdx && <div className='divider my-0 py-0 h-1' />}
    </>
  )
}

export default Conversation