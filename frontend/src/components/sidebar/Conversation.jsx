import { useState, useEffect } from 'react'
import { useSocketContext } from '../../context/SocketContext'
import notificationSound from '../../assets/sounds/notification.mp3'
import { useGetUnseenMessagesQuery } from '../../redux/api/messageApiSlice'
import useStore from '../../zustand/store'

const Conversation = ({ conversation, lastIdx }) => {
  // console.log('Conversation')
  const { selectedConversation, setSelectedConversation, messages } = useStore()
  const isSelected = selectedConversation?._id === (conversation?._id || conversation?.user?._id)
  const { onlineUsers, socket } = useSocketContext()
  const isOnline = onlineUsers.includes(conversation?.user?._id)
  const [unseenMessages, setUnseenMessages] = useState(0)
  const { data, isFetching } = useGetUnseenMessagesQuery(
    conversation?.user?._id,
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    if (!isFetching) setUnseenMessages(data)
  }, [isFetching])

  useEffect(() => {
    console.log('Conversation effect')
    socket?.on('newNotification', (newMessage) => {
      console.log('newNotification')
      if (newMessage.senderId === conversation?.user?._id) {
        const sound = new Audio(notificationSound)
        sound.play()
        setUnseenMessages(prev => prev + 1)
      }
    })

    return () => {
      socket?.removeAllListeners('newNotification')
    }
  }, [socket])

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
				${isSelected ? 'bg-sky-500' : ''}
			`}
        onClick={() => {
          setSelectedConversation(
            conversation?._id ? conversation : conversation?.user
          )
          setUnseenMessages(0)
        }}
      >
        <div className={`avatar ${isOnline ? 'online' : ''}`}>
          <div className='w-12 rounded-full'>
            <img src={conversation?.user?.profilePic} alt='user avatar' />
          </div>
        </div>

        <div className='flex flex-col flex-1'>
          <div className='flex gap-3 justify-between'>
            <p className='font-bold text-gray-200'>
              {conversation?.user?.fullName}
            </p>
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