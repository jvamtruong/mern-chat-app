import { useState, useEffect } from 'react'
import { useSocketContext } from '../../context/SocketContext'
import notificationSound from '../../assets/sounds/notification.mp3'
import { useGetUnseenMessagesQuery } from '../../redux/api/messageApiSlice'
import useConversationStore from '../../zustand/conversationStore'

const Conversation = ({ conversation, lastIdx, emoji }) => {
  // console.log('Conversation')
  const { selectedConversation, setSelectedConversation } = useConversationStore()
  const isSelected = selectedConversation?._id === conversation._id
  const { onlineUsers, socket } = useSocketContext()
  const isOnline = onlineUsers.includes(conversation._id)
  const [unseenMessages, setUnseenMessages] = useState(0)
  const { data, isFetching } = useGetUnseenMessagesQuery(conversation._id, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (!isFetching) setUnseenMessages(data)
  }, [isFetching])

  useEffect(() => {
    // socket?.on("newMessage", (newMessage) => {
    //   if (newMessage.senderId.toString() === conversation._id.toString()) {
    //     // const sound = new Audio(notificationSound)
    // 	  // sound.play()
    //     setUnseenMessages(unseenMessages + 1)
    //   }
    // })
    // console.log('conv effect')
    socket?.on('newNotification', (newMessage) => {
      if (newMessage.senderId.toString() === conversation._id.toString()) {
        // const sound = new Audio(notificationSound)
        // sound.play()
        setUnseenMessages(unseenMessages + 1)
      }
    })

    return () => socket?.off('newMessage')
  })

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
            <img src={conversation.profilePic} alt='user avatar' />
          </div>
        </div>

        <div className='flex flex-col flex-1'>
          <div className='flex gap-3 justify-between'>
            <p className='font-bold text-gray-200'>{conversation.fullName}</p>
            <span className='text-base text-red-600 font-semibold'>
              {unseenMessages ? unseenMessages : ''}
            </span>
            {/* <span className='text-xl'>{emoji}</span> */}
          </div>
        </div>
      </div>

      {!lastIdx && <div className='divider my-0 py-0 h-1' />}
    </>
  )
}

export default Conversation